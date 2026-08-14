"""Unified file router: classify (extension + magic) and dispatch inspect/clean.

Formats handled:
  text     — Layer A Unicode scrub (inspect_text/clean_text)
  image    — PNG/JPEG metadata strip (inspect_image/clean_image)
  container — SVG/PDF/DOCX/ODT/HTML/MD (inspect_container/clean_container)

Verification flow for clean: original -> inspect, cleaned -> inspect, then a
JSON report with the ``detected`` / ``removed`` / ``remaining`` triple and a
``verification`` status (passed|partial|failed).
"""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

from common import (
    MAX_INPUT_BYTES,
    VERIFICATION_NOTE,
    backup_path,
    classify_finding_confidence,
    cleaned_path,
    eprint,
    guard_binary,
    looks_binary,
    safe_write_text,
)
from container_meta import clean_container, detect_container_format, inspect_container
from image_meta import clean_image, detect_format as detect_image_format, inspect_image
from text_unicode import clean_text, inspect_text

IMAGE_EXTS = {".png", ".jpg", ".jpeg"}
CONTAINER_EXTS = {".svg", ".pdf", ".docx", ".odt", ".html", ".htm", ".md", ".markdown", ".mdx"}
TEXT_EXTS = {
    ".txt", ".text", ".markdown", ".mdx", ".css", ".js", ".mjs", ".cjs", ".ts", ".tsx",
    ".jsx", ".py", ".rs", ".go", ".json", ".yaml", ".yml", ".toml", ".csv", ".sql", ".xml",
}


def classify(path: Path) -> str:
    ext = path.suffix.lower()
    if ext in IMAGE_EXTS:
        return "image"
    if ext in CONTAINER_EXTS:
        return "container"
    if ext in TEXT_EXTS:
        return "text"
    data = path.read_bytes()
    if detect_image_format(data) in ("png", "jpeg"):
        return "image"
    if detect_container_format(path, data) != "unknown":
        return "container"
    return "text"


def inspect_file(path: Path, *, aggressive: bool = False) -> dict[str, Any]:
    kind = classify(path)
    if kind == "text":
        text = _read_text_guarded(path)
        rep = inspect_text(text, aggressive=aggressive)
        return {"kind": "text", **rep.to_dict()}
    if kind == "image":
        rep = inspect_image(path)
        return {"kind": "image", **rep.to_dict()}
    rep = inspect_container(path)
    return {"kind": "container", **rep.to_dict()}


def _read_text_guarded(path: Path, *, force_text: bool = False) -> str:
    data = path.read_bytes()
    guard_binary(
        data,
        str(path),
        allow_binary=force_text,
        advice=(
            "This path classified as text but the bytes look like a container.",
            "Pass --force-text to scan the raw bytes anyway.",
        ),
    )
    return data.decode("utf-8", errors="surrogateescape")


def _verification_status(detected_count: int, remaining_count: int) -> str:
    if remaining_count == 0:
        return "passed"
    if detected_count is None or detected_count == 0:
        return "failed"
    if remaining_count < detected_count:
        return "partial"
    return "failed"


def _clean_text_flow(
    path: Path,
    dest: Path,
    *,
    force_text: bool,
    nfkc: bool,
    aggressive_homoglyphs: bool,
) -> dict[str, Any]:
    data = path.read_bytes()
    guard_binary(
        data,
        str(path),
        allow_binary=force_text,
        advice=(
            "This path classified as text but the bytes look like a container.",
            "Pass --force-text to clean the raw bytes anyway (may corrupt the file).",
        ),
    )
    text = data.decode("utf-8", errors="surrogateescape")
    before = inspect_text(text, aggressive=aggressive_homoglyphs)
    cleaned, stats = clean_text(
        text,
        nfkc=nfkc,
        aggressive_homoglyphs=aggressive_homoglyphs,
    )
    safe_write_text(dest, cleaned)
    after = inspect_text(cleaned)
    detected = [f"{h.label} x{h.count}" for h in before.hits]
    remaining = [f"{h.label} x{h.count}" for h in after.hits]
    actions = [f"removed {v} chars of {k}" for k, v in stats["removed"].items()]
    actions = actions or (["replaced chars"] if stats["replaced_count"] else ["no changes"])
    return {
        "kind": "text",
        "input": str(path),
        "output": str(dest),
        "detected": detected,
        "removed": actions,
        "remaining": remaining,
        "stats": stats,
        "verification": _verification_status(len(detected), len(remaining)),
        "note": VERIFICATION_NOTE if remaining else None,
    }


def _clean_image_flow(path: Path, dest: Path, *, keep_non_ai_metadata: bool) -> dict[str, Any]:
    before = inspect_image(path)
    result = clean_image(path, dest, strip_all_metadata=not keep_non_ai_metadata)
    after = inspect_image(dest)
    detected = list(before.findings)
    removed = list(result["actions"])
    remaining = list(after.findings)
    return {
        "kind": "image",
        "input": str(path),
        "output": str(dest),
        "format": result["format"],
        "detected": detected,
        "removed": removed,
        "remaining": remaining,
        "verification": _verification_status(len(detected), len(remaining)),
        "note": VERIFICATION_NOTE if remaining else None,
        "bytes_in": result["bytes_in"],
        "bytes_out": result["bytes_out"],
    }


def _clean_container_flow(path: Path, dest: Path) -> dict[str, Any]:
    before = inspect_container(path)
    result = clean_container(path, dest)
    after = inspect_container(dest)
    detected = list(before.findings)
    removed = list(result["actions"])
    remaining = list(after.findings)
    return {
        "kind": "container",
        "input": str(path),
        "output": str(dest),
        "format": result["format"],
        "detected": detected,
        "removed": removed,
        "remaining": remaining,
        "verification": _verification_status(len(detected), len(remaining)),
        "note": VERIFICATION_NOTE if remaining else None,
        "bytes_in": result["bytes_in"],
        "bytes_out": result["bytes_out"],
        "meta": result.get("meta"),
    }


def clean_file(
    path: Path,
    *,
    output: Path | None = None,
    in_place: bool = False,
    force_type: str = "auto",
    force_text: bool = False,
    nfkc: bool = False,
    aggressive_homoglyphs: bool = False,
    keep_non_ai_metadata: bool = False,
    json_out: bool = False,
) -> dict[str, Any]:
    """Clean ``path`` and return the unified report.

    Never overwrites the original unless ``in_place`` (which first writes a
    ``.bak``). Default output is ``<stem>.cleaned<suffix>``.
    """
    if not path.is_file():
        raise FileNotFoundError(f"not a file: {path}")
    if path.stat().st_size > MAX_INPUT_BYTES:
        raise ValueError(f"refusing input larger than {MAX_INPUT_BYTES} bytes: {path}")

    kind = force_type if force_type != "auto" else classify(path)

    if in_place:
        # Sniff before taking a backup: refusing afterwards leaves a .bak
        # behind for a file this run never touches.
        if kind == "text":
            data = path.read_bytes()
            if looks_binary(data) and not force_text:
                raise SystemExit(2)
        bak = backup_path(path)
        dest = path
    else:
        dest = output or cleaned_path(path)

    if kind == "text":
        rep = _clean_text_flow(
            path,
            dest,
            force_text=force_text,
            nfkc=nfkc,
            aggressive_homoglyphs=aggressive_homoglyphs,
        )
    elif kind == "image":
        rep = _clean_image_flow(path, dest, keep_non_ai_metadata=keep_non_ai_metadata)
    elif kind == "container":
        rep = _clean_container_flow(path, dest)
    else:
        raise ValueError(f"unsupported kind: {kind}")

    if json_out:
        print(json.dumps(rep, indent=2, ensure_ascii=False))
    return rep


def main_clean() -> int:
    import argparse

    p = argparse.ArgumentParser(description="Clean AI marks from a file (unified router).")
    p.add_argument("path", type=Path)
    p.add_argument("-o", "--output", type=Path, help="Output path (default: *.cleaned.*)")
    p.add_argument("--in-place", action="store_true", help="Overwrite input (creates .bak)")
    p.add_argument("--json", action="store_true", help="Force JSON report")
    p.add_argument("--nfkc", action="store_true", help="Text: NFKC normalize")
    p.add_argument("--aggressive-homoglyphs", action="store_true")
    p.add_argument("--keep-non-ai-metadata", action="store_true")
    p.add_argument(
        "--as",
        dest="force_type",
        choices=("auto", "text", "image", "container"),
        default="auto",
    )
    p.add_argument("--force-text", action="store_true")
    args = p.parse_args()

    try:
        clean_file(
            args.path,
            output=args.output,
            in_place=args.in_place,
            force_type=args.force_type,
            force_text=args.force_text,
            nfkc=args.nfkc,
            aggressive_homoglyphs=args.aggressive_homoglyphs,
            keep_non_ai_metadata=args.keep_non_ai_metadata,
            json_out=True,
        )
    except (FileNotFoundError, ValueError, OSError) as e:
        eprint(f"error: {e}")
        return 2
    except SystemExit as e:
        return int(e.code) if isinstance(e.code, int) else 2
    return 0


def main_inspect() -> int:
    import argparse

    p = argparse.ArgumentParser(description="Inspect AI marks in a file (unified router).")
    p.add_argument("path", type=Path)
    p.add_argument("--json", action="store_true", help="Force JSON report")
    p.add_argument("--aggressive", action="store_true", help="Text: flag confusables")
    p.add_argument(
        "--as",
        dest="force_type",
        choices=("text", "image", "container", "auto"),
        default="auto",
    )
    args = p.parse_args()

    path = args.path
    if not path.is_file():
        eprint(f"not a file: {path}")
        return 2
    if path.stat().st_size > MAX_INPUT_BYTES:
        eprint(f"refusing input larger than {MAX_INPUT_BYTES} bytes: {path}")
        return 2

    kind = args.force_type if args.force_type != "auto" else classify(path)
    if kind == "text" and args.force_type in ("text",):
        text = _read_text_guarded(path)
        rep = {"kind": "text", **inspect_text(text, aggressive=args.aggressive).to_dict()}
    else:
        rep = inspect_file(path, aggressive=args.aggressive)

    if args.json:
        print(json.dumps(rep, indent=2, ensure_ascii=False))
    else:
        _human_inspect(rep)
    return 0


def _human_inspect(rep: dict[str, Any]) -> None:
    print(f"Kind: {rep.get('kind')}")
    if rep.get("kind") == "text":
        print(f"Suspicious: {rep.get('suspicious_total', 0)}")
        for h in rep.get("hits", []):
            print(f"  - [{h.get('confidence')}] {h.get('label')} x{h.get('count')} @ {h.get('sample_offsets', [])}")
        for n in rep.get("notes", []):
            print(f"Note: {n}")
        return
    print(f"Path: {rep.get('path')}")
    print(f"Format: {rep.get('format')}")
    print(f"C2PA: {bool(rep.get('has_c2pa'))}")
    print(f"AI metadata: {bool(rep.get('has_ai_metadata'))}")
    for f in rep.get("findings", []):
        print(f"  - [{classify_finding_confidence(f)}] {f}")
    for n in rep.get("notes", []):
        print(f"Note: {n}")