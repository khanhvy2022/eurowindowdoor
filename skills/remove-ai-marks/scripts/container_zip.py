"""Inspect/clean AI provenance metadata in ZIP-based office containers: DOCX, ODT."""

from __future__ import annotations

import io
import re
import zipfile

from container_text import AI_META_NAME_RE, _blob_hits

MAX_ZIP_DECOMPRESSED_BYTES = 128 * 1024 * 1024

DOCX_META_PARTS = (
    "docProps/core.xml",
    "docProps/app.xml",
    "docProps/custom.xml",
)


def _check_zip_budget(info: zipfile.ZipInfo, budget: list[int]) -> None:
    budget[0] += info.file_size
    if budget[0] > MAX_ZIP_DECOMPRESSED_BYTES:
        raise ValueError(
            "zip decompressed size exceeds cap "
            f"({MAX_ZIP_DECOMPRESSED_BYTES} bytes); refusing to process"
        )


def _is_docx_meta_part(name: str) -> bool:
    return name.startswith(("docProps/", "customXml/"))


def inspect_docx(data: bytes) -> tuple[bool, bool, list[str], dict]:
    findings: list[str] = []
    has_c2pa = False
    has_ai = False
    budget = [0]
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as zf:
            parts = zf.namelist()
            for info in zf.infolist():
                _check_zip_budget(info, budget)
                name = info.filename
                if not _is_docx_meta_part(name):
                    continue
                raw = zf.read(name)
                c2, ai, hits = _blob_hits(raw)
                if c2 or ai:
                    if c2:
                        has_c2pa = True
                    if ai:
                        has_ai = True
                    findings.append(f"{name}: {', '.join(hits[:6])}")
            custom = [n for n in parts if n.startswith("customXml/")]
            if custom:
                findings.append(f"customXml parts: {len(custom)}")
    except zipfile.BadZipFile:
        return False, False, ["not a valid DOCX zip"], {}
    return has_c2pa, has_ai or has_c2pa, findings, {"parts": len(parts)}


def clean_docx(data: bytes) -> tuple[bytes, list[str]]:
    actions: list[str] = []
    out_buf = io.BytesIO()
    budget = [0]
    with zipfile.ZipFile(io.BytesIO(data)) as zin, zipfile.ZipFile(
        out_buf, "w", compression=zipfile.ZIP_DEFLATED
    ) as zout:
        for info in zin.infolist():
            name = info.filename
            _check_zip_budget(info, budget)
            raw = zin.read(name)
            if name.startswith("customXml/"):
                actions.append(f"drop part {name}")
                continue
            if name in DOCX_META_PARTS or name.startswith("docProps/"):
                text = raw.decode("utf-8", errors="replace")
                new = text
                for pat, label in (
                    (r"(<dc:creator[^>]*>)(.*?)(</dc:creator>)", "dc:creator"),
                    (r"(<cp:lastModifiedBy[^>]*>)(.*?)(</cp:lastModifiedBy>)", "cp:lastModifiedBy"),
                    (r"(<Application[^>]*>)(.*?)(</Application>)", "Application"),
                    (r"(<AppVersion[^>]*>)(.*?)(</AppVersion>)", "AppVersion"),
                ):
                    def _sub(m: re.Match[str], _label=label) -> str:
                        inner = m.group(2)
                        if AI_META_NAME_RE.search(inner) or AI_META_NAME_RE.search(_label):
                            actions.append(f"scrub {name} field {_label}")
                            return m.group(1) + m.group(3)
                        if _label in ("Application", "AppVersion") and re.search(
                            r"claude|openai|anthropic|gemini|chatgpt|synthid|copilot",
                            inner,
                            re.I,
                        ):
                            actions.append(f"scrub {name} field {_label}")
                            return m.group(1) + m.group(3)
                        return m.group(0)

                    new = re.sub(pat, _sub, new, flags=re.I | re.DOTALL)
                if name.endswith("custom.xml") and (
                    _blob_hits(raw)[1] or AI_META_NAME_RE.search(text)
                ):
                    actions.append(f"drop part {name}")
                    continue
                raw = new.encode("utf-8")
            if name == "[Content_Types].xml":
                text = raw.decode("utf-8", errors="replace")
                new, n = re.subn(
                    r'<Override\b[^>]*PartName="/customXml/[^"]*"[^>]*/>',
                    "",
                    text,
                )
                if n:
                    actions.append(f"drop Content_Types customXml overrides x{n}")
                    raw = new.encode("utf-8")
            zout.writestr(info, raw)
    if not actions:
        actions.append("no DOCX metadata parts removed")
    return out_buf.getvalue(), actions


def inspect_odt(data: bytes) -> tuple[bool, bool, list[str], dict]:
    findings: list[str] = []
    has_c2pa = False
    has_ai = False
    budget = [0]
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as zf:
            for info in zf.infolist():
                _check_zip_budget(info, budget)
                raw = zf.read(info.filename)
                c2, ai, hits = _blob_hits(raw)
                if c2 or ai:
                    if c2:
                        has_c2pa = True
                    if ai:
                        has_ai = True
                    findings.append(f"{info.filename}: {', '.join(hits[:6])}")
            if "meta.xml" in zf.namelist():
                meta = zf.read("meta.xml").decode("utf-8", errors="replace")
                if re.search(r"generator|claude|openai|anthropic|gemini", meta, re.I):
                    has_ai = True
                    findings.append("meta.xml generator-like fields")
    except zipfile.BadZipFile:
        return False, False, ["not a valid ODT zip"], {}
    return has_c2pa, has_ai or has_c2pa, findings, {}


def clean_odt(data: bytes) -> tuple[bytes, list[str]]:
    actions: list[str] = []
    out_buf = io.BytesIO()
    budget = [0]
    with zipfile.ZipFile(io.BytesIO(data)) as zin, zipfile.ZipFile(
        out_buf, "w", compression=zipfile.ZIP_DEFLATED
    ) as zout:
        for info in zin.infolist():
            name = info.filename
            _check_zip_budget(info, budget)
            raw = zin.read(name)
            if name == "meta.xml":
                text = raw.decode("utf-8", errors="replace")
                new, n = re.subn(
                    r"<meta:generator\b[^>]*>.*?</meta:generator\s*>",
                    "",
                    text,
                    flags=re.I | re.DOTALL,
                )
                if n:
                    actions.append("drop meta:generator")
                    text = new

                def _creator(m: re.Match[str]) -> str:
                    if AI_META_NAME_RE.search(m.group(0)):
                        actions.append("scrub creator-like meta")
                        return ""
                    return m.group(0)

                text = re.sub(
                    r"<dc:creator\b[^>]*>.*?</dc:creator\s*>",
                    _creator,
                    text,
                    flags=re.I | re.DOTALL,
                )
                raw = text.encode("utf-8")
            else:
                c2, ai, _ = _blob_hits(raw)
                if (c2 or ai) and name not in (
                    "content.xml",
                    "styles.xml",
                    "mimetype",
                    "META-INF/manifest.xml",
                ):
                    actions.append(f"drop part {name} (AI/C2PA markers)")
                    continue
            zout.writestr(info, raw)
    if not actions:
        actions.append("no ODT metadata removed")
    return out_buf.getvalue(), actions