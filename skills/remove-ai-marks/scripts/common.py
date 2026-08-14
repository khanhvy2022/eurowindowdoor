"""Shared helpers for remove-ai-marks (adapted from guillaumemeyer/watermarks-remover, MIT)."""

from __future__ import annotations

import json
import os
import sys
import tempfile
from pathlib import Path
from typing import Any

VERSION = "1.0.0"

# Hard caps on input sizes; whole-file in-memory processing means large inputs
# are a host-memory DoS. Env overrides are the explicit escape hatch.
MAX_INPUT_BYTES = int(os.environ.get("WATERMARKS_MAX_INPUT_BYTES", str(256 << 20)))
MAX_STDIN_BYTES = int(os.environ.get("WATERMARKS_MAX_STDIN_BYTES", str(64 << 20)))

_CHILD_RLIMIT_AS = int(os.environ.get("WATERMARKS_CHILD_RLIMIT_AS", str(4 << 30)))
_CHILD_RLIMIT_FSIZE = int(os.environ.get("WATERMARKS_CHILD_RLIMIT_FSIZE", str(2 << 30)))

VERIFICATION_NOTE = "Best effort — cannot guarantee complete removal."

CONFIDENCE_CONFIRMED = "confirmed"
CONFIDENCE_PROBABLE = "probable"
CONFIDENCE_INFORMATIONAL = "informational"
CONFIDENCE_FALSE_POSITIVE = "likely_false_positive"
CONFIDENCE_LEVELS = (
    CONFIDENCE_CONFIRMED,
    CONFIDENCE_PROBABLE,
    CONFIDENCE_INFORMATIONAL,
    CONFIDENCE_FALSE_POSITIVE,
)


def eprint(*args: object) -> None:
    print(*args, file=sys.stderr)


def _reconfigure(stream: Any, errors: str) -> None:
    reconfigure = getattr(stream, "reconfigure", None)
    if reconfigure is not None:
        try:
            reconfigure(encoding="utf-8", errors=errors)
        except (OSError, ValueError, AttributeError):
            pass


def _configure_stdio() -> None:
    _reconfigure(sys.stdin, "surrogateescape")
    _reconfigure(sys.stdout, "backslashreplace")
    _reconfigure(sys.stderr, "backslashreplace")


_configure_stdio()


BINARY_MAGIC: tuple[tuple[bytes, str], ...] = (
    (b"PK\x03\x04", "a ZIP container (DOCX, ODT, XLSX, PPTX, EPUB, JAR)"),
    (b"%PDF-", "a PDF"),
    (b"\x89PNG\r\n\x1a\n", "a PNG image"),
    (b"\xff\xd8\xff", "a JPEG image"),
    (b"GIF87a", "a GIF image"),
    (b"GIF89a", "a GIF image"),
    (b"II*\x00", "a TIFF image"),
    (b"MM\x00*", "a TIFF image"),
    (b"RIFF", "a RIFF container (WEBP, WAV, AVI)"),
    (b"OggS", "an Ogg media file"),
    (b"\x1f\x8b", "a gzip archive"),
    (b"BZh", "a bzip2 archive"),
    (b"\xfd7zXZ\x00", "an xz archive"),
    (b"7z\xbc\xaf\x27\x1c", "a 7-Zip archive"),
    (b"Rar!\x1a\x07", "a RAR archive"),
    (b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1", "a legacy Office document (.doc, .xls, .ppt)"),
)

BINARY_SNIFF_BYTES = 8192


def looks_binary(data: bytes) -> str | None:
    if not data:
        return None
    for magic, label in BINARY_MAGIC:
        if data.startswith(magic):
            return label
    head = data[:BINARY_SNIFF_BYTES]
    if b"\x00" in head:
        return "binary data (contains NUL bytes)"
    return None


def is_probably_text(data: bytes) -> bool:
    if not data:
        return True
    for magic, label in BINARY_MAGIC:
        if data.startswith(magic):
            return False
    try:
        data[:4096].decode("utf-8")
        return True
    except UnicodeDecodeError:
        return False


TEXT_TOOL_ADVICE = (
    "Use inspect_file.py / clean_file.py, which route by format,",
    "or pass --force-text to scan the raw bytes anyway.",
)
ROUTER_ADVICE = (
    "These bytes match no supported format.",
    "Pass --force-text to handle them as text anyway.",
)


def guard_binary(
    data: bytes,
    origin: str,
    *,
    allow_binary: bool = False,
    advice: tuple[str, ...] | None = None,
) -> None:
    if allow_binary:
        return
    kind = looks_binary(data)
    if kind is None:
        return
    eprint(f"refusing to treat {origin} as text: it looks like {kind}.")
    for line in advice or TEXT_TOOL_ADVICE:
        eprint(line)
    raise SystemExit(2)


def read_text_input(
    path: str | None,
    *,
    allow_binary: bool = False,
    advice: tuple[str, ...] | None = None,
) -> str:
    if path is None or path == "-":
        return _read_stdin_capped(allow_binary=allow_binary, advice=advice)
    p = Path(path)
    try:
        size = p.stat().st_size
    except OSError:
        size = 0
    if size > MAX_INPUT_BYTES:
        eprint(f"refusing input larger than {MAX_INPUT_BYTES} bytes: {path}")
        raise SystemExit(2)
    data = p.read_bytes()
    guard_binary(data, str(path), allow_binary=allow_binary, advice=advice)
    return data.decode("utf-8", errors="surrogateescape")


def _read_stdin_capped(
    *,
    allow_binary: bool = False,
    advice: tuple[str, ...] | None = None,
) -> str:
    stream = getattr(sys.stdin, "buffer", None)
    if stream is None:
        text = sys.stdin.read()
        if len(text.encode("utf-8", errors="surrogateescape")) > MAX_STDIN_BYTES:
            eprint(f"refusing stdin input larger than {MAX_STDIN_BYTES} bytes")
            raise SystemExit(2)
        guard_binary(
            text[:BINARY_SNIFF_BYTES].encode("utf-8", errors="surrogateescape"),
            "stdin",
            allow_binary=allow_binary,
            advice=advice,
        )
        return text
    chunks: list[bytes] = []
    total = 0
    while True:
        chunk = stream.read(1 << 20)
        if not chunk:
            break
        if not chunks:
            guard_binary(
                chunk[:BINARY_SNIFF_BYTES],
                "stdin",
                allow_binary=allow_binary,
                advice=advice,
            )
        total += len(chunk)
        if total > MAX_STDIN_BYTES:
            eprint(f"refusing stdin input larger than {MAX_STDIN_BYTES} bytes")
            raise SystemExit(2)
        chunks.append(chunk)
    return b"".join(chunks).decode("utf-8", errors="surrogateescape")


def write_text_output(text: str, path: str | None) -> None:
    if path is None or path == "-" or path == "":
        sys.stdout.write(text)
        if text and not text.endswith("\n"):
            sys.stdout.write("\n")
        return
    safe_write_text(path, text)


def _default_file_mode() -> int:
    mask = os.umask(0)
    os.umask(mask)
    return 0o666 & ~mask


def safe_write_bytes(path: str | Path, data: bytes) -> None:
    dest = Path(path)
    parent = dest.parent
    parent.mkdir(parents=True, exist_ok=True)
    if dest.is_symlink():
        raise OSError(f"refusing to write through symlink: {dest}")
    fd, tmp_name = tempfile.mkstemp(prefix=f".{dest.name}.", suffix=".tmp", dir=str(parent))
    try:
        if hasattr(os, "fchmod"):
            os.fchmod(fd, _default_file_mode())
        with os.fdopen(fd, "wb") as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp_name, dest)
    except BaseException:
        try:
            os.unlink(tmp_name)
        except OSError:
            pass
        raise


def safe_write_text(path: str | Path, text: str) -> None:
    safe_write_bytes(path, text.encode("utf-8", errors="surrogateescape"))


def backup_path(src: Path) -> Path:
    bak = src.with_suffix(src.suffix + ".bak")
    try:
        safe_write_bytes(bak, src.read_bytes())
    except OSError as e:
        eprint(f"cannot create backup {bak}: {e}")
        raise SystemExit(2)
    return bak


def cleaned_path(src: Path, suffix: str = ".cleaned") -> Path:
    return src.with_name(f"{src.stem}{suffix}{src.suffix}")


def subprocess_rlimits() -> None:
    try:
        import resource

        resource.setrlimit(resource.RLIMIT_AS, (_CHILD_RLIMIT_AS, _CHILD_RLIMIT_AS))
        resource.setrlimit(resource.RLIMIT_FSIZE, (_CHILD_RLIMIT_FSIZE, _CHILD_RLIMIT_FSIZE))
    except (ImportError, OSError, ValueError):
        pass


subprocess_preexec_fn = subprocess_rlimits if os.name == "posix" else None


def emit_json(data: Any) -> None:
    json.dump(data, sys.stdout, indent=2, ensure_ascii=False)
    sys.stdout.write("\n")


def classify_finding_confidence(finding: str) -> str:
    """Map a scanner finding to one of the four confidence buckets.

    - confirmed: a recognized provenance structure (C2PA/JUMBF manifest, parsed
      field such as digitalSourceType / trainedAlgorithmicMedia).
    - probable: a vendor/AI marker inside recognized metadata.
    - informational: context-only notes (CMS generators, XMP presence,
      unsupported format).
    - likely_false_positive: whole-file byte scans that can collide with
      compressed data.
    """
    t = finding.lower()
    if any(
        s in t
        for s in (
            "c2patool reports",
            "c2pa-related manifest",
            "png chunk c2",
            "png chunk cabx",
            "png chunk jumb",
            "jpeg app11",
            "digital_source_type",
            "digitalsourcetype",
            "trainedalgorithmicmedia",
            "compositewithtrainedalgorithmicmedia",
            "softwareagent",
        )
    ):
        return CONFIDENCE_CONFIRMED
    if t.startswith("info:") or any(
        s in t
        for s in (
            "cms generator",
            "customxml parts",
            "xmp packet present",
            "unsupported",
            "svg <metadata> present",
            "not a valid",
            "truncated chunk",
            "bad segment length",
            "svg decode note",
        )
    ):
        return CONFIDENCE_INFORMATIONAL
    if "byte-scan" in t:
        return CONFIDENCE_FALSE_POSITIVE
    if any(
        s in t
        for s in (
            "ai:",
            "marker:",
            "meta:",
            "frontmatter",
            "json-ld",
            "attr:",
            "png ",
            "jpeg app",
            "exif",
            "xmp",
            "interesting",
            "pdf-structured",
        )
    ):
        return CONFIDENCE_PROBABLE
    return CONFIDENCE_INFORMATIONAL


def which(cmd: str) -> str | None:
    from shutil import which as _which

    return _which(cmd)


def safe_arg(path: str) -> str:
    if path.startswith("-"):
        return "./" + path
    return path


def http_url_valid(url: str) -> bool:
    from urllib.parse import urlparse

    parsed = urlparse(url)
    return parsed.scheme in ("http", "https") and bool(parsed.hostname)