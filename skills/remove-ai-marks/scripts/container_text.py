"""Inspect/clean AI provenance metadata in text-based containers: SVG, HTML, Markdown."""

from __future__ import annotations

import re

from common import classify_finding_confidence
from image_meta import AI_META_HINTS, C2PA_MARKERS, _contains_any

AI_FRONTMATTER_KEYS = frozenset(
    {
        "generator", "ai", "ai_generated", "ai-generated", "claude", "anthropic",
        "openai", "gemini", "synthid", "c2pa", "content_credentials",
        "contentcredentials", "provenance", "digital_source_type",
        "digitalsourcetype", "created_with", "createdwith", "model", "llm",
    }
)

AI_META_NAME_RE = re.compile(
    r"generator|ai[-_ ]?generated|claude|anthropic|openai|gemini|synthid|"
    r"c2pa|content.?credential|provenance|digital.?source|aigc",
    re.I,
)

_FM_RE = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n?", re.DOTALL)

_META_TAG_RE = re.compile(r"<meta\b[^>]*>", re.I)
_META_ATTR_RE = re.compile(r"""(name|property|content|generator)\s*=\s*["']([^"']*)["']""", re.I)

_GENERATOR_AI_RE = re.compile(
    r"claude|anthropic|openai|chatgpt|gemini|synthid|copilot|midjourney|dall.?e|stable.?diffusion",
    re.I,
)

_JSONLD_RE = re.compile(
    r"<script\b[^>]*type\s*=\s*[\"']application/ld\+json[\"'][^>]*>.*?</script>",
    re.I | re.DOTALL,
)


def _parse_simple_yaml_keys(block: str) -> list[tuple[str, str, int]]:
    rows: list[tuple[str, str, int]] = []
    for i, line in enumerate(block.splitlines()):
        if not line.strip() or line.strip().startswith("#"):
            continue
        if line[0] in (" ", "\t", "-"):
            continue
        m = re.match(r"^([A-Za-z0-9_.-]+)\s*:", line)
        if m:
            rows.append((m.group(1), line, i))
    return rows


def inspect_markdown(text: str) -> tuple[bool, bool, list[str], dict]:
    findings: list[str] = []
    has_ai = False
    m = _FM_RE.match(text)
    if not m:
        return False, False, [], {"has_frontmatter": False}
    block = m.group(1)
    keys: list[str] = []
    for key, _line, _i in _parse_simple_yaml_keys(block):
        keys.append(key)
        if key.lower() in AI_FRONTMATTER_KEYS or AI_META_NAME_RE.search(key):
            has_ai = True
            findings.append(f"frontmatter key: {key}")
        val = _line.split(":", 1)[1] if ":" in _line else ""
        if AI_META_NAME_RE.search(val):
            has_ai = True
            findings.append(f"frontmatter value hit on {key}")
    c2pa = any("c2pa" in f.lower() or "content" in f.lower() for f in findings)
    return c2pa, has_ai, findings, {"has_frontmatter": True, "keys": keys}


def clean_markdown(text: str) -> tuple[str, list[str]]:
    actions: list[str] = []
    m = _FM_RE.match(text)
    if not m:
        return text, ["no YAML frontmatter"]
    block = m.group(1)
    body = text[m.end() :]
    kept: list[str] = []
    for line in block.splitlines():
        if not line.strip() or line.strip().startswith("#") or line[0] in (" ", "\t", "-"):
            if kept and line[0] in (" ", "\t", "-"):
                kept.append(line)
            elif not line.strip() or line.strip().startswith("#"):
                kept.append(line)
            continue
        km = re.match(r"^([A-Za-z0-9_.-]+)\s*:", line)
        if km:
            key = km.group(1)
            if key.lower() in AI_FRONTMATTER_KEYS or AI_META_NAME_RE.search(key):
                actions.append(f"drop frontmatter key: {key}")
                continue
            val = line.split(":", 1)[1] if ":" in line else ""
            if AI_META_NAME_RE.search(val):
                actions.append(f"drop frontmatter key (value hit): {key}")
                continue
            kept.append(line)
        else:
            kept.append(line)
    if not actions:
        actions.append("no AI frontmatter keys removed")
    new_block = "\n".join(kept).strip("\n")
    if new_block:
        out = f"---\n{new_block}\n---\n{body}"
    else:
        out = body.lstrip("\n")
        actions.append("removed empty frontmatter block")
    return out, actions


def _meta_attrs(tag: str) -> dict[str, str]:
    return dict(_META_ATTR_RE.findall(tag))


def _is_cms_generator_meta(tag: str) -> bool:
    attrs = _meta_attrs(tag)
    name_or_prop = (attrs.get("name") or attrs.get("property") or attrs.get("generator") or "").lower()
    if name_or_prop != "generator":
        return False
    if _GENERATOR_AI_RE.search(attrs.get("content", "")) or _GENERATOR_AI_RE.search(tag):
        return False
    return True


def inspect_html(text: str) -> tuple[bool, bool, list[str], dict]:
    findings: list[str] = []
    has_ai = False
    has_c2pa = False
    for tag in _META_TAG_RE.findall(text):
        if re.search(r"c2pa|content.?credential", tag, re.I):
            has_c2pa = True
        if _is_cms_generator_meta(tag):
            findings.append(f"info: cms generator: {tag[:120]}")
            continue
        if AI_META_NAME_RE.search(tag) or any(
            h.decode("ascii", "ignore").lower() in tag.lower() for h in AI_META_HINTS[:12]
        ):
            has_ai = True
            findings.append(f"meta: {tag[:120]}")
    for m in _JSONLD_RE.finditer(text):
        blob = m.group(0)
        if AI_META_NAME_RE.search(blob) or re.search(
            r"DigitalSourceType|trainedAlgorithmicMedia|SoftwareAgent", blob, re.I
        ):
            has_ai = True
            findings.append("json-ld provenance-like block")
            if re.search(r"c2pa|contentcredential", blob, re.I):
                has_c2pa = True
    for m in re.finditer(r"\bdata-ai[\w-]*\s*=\s*[\"'][^\"']*[\"']", text, re.I):
        has_ai = True
        findings.append(f"attr: {m.group(0)[:80]}")
    return has_c2pa, has_ai, findings, {}


def clean_html(text: str) -> tuple[str, list[str]]:
    actions: list[str] = []

    def _meta_sub(m: re.Match[str]) -> str:
        tag = m.group(0)
        if _is_cms_generator_meta(tag):
            return tag
        if AI_META_NAME_RE.search(tag) or re.search(
            r"generator|claude|anthropic|openai|gemini|synthid|c2pa|aigc", tag, re.I
        ):
            actions.append(f"drop meta: {tag[:80]}")
            return ""
        return tag

    out = _META_TAG_RE.sub(_meta_sub, text)

    def _jsonld_sub(m: re.Match[str]) -> str:
        blob = m.group(0)
        if AI_META_NAME_RE.search(blob) or re.search(
            r"DigitalSourceType|trainedAlgorithmicMedia|SoftwareAgent", blob, re.I
        ):
            actions.append("drop json-ld provenance-like script")
            return ""
        return blob

    out = _JSONLD_RE.sub(_jsonld_sub, out)
    out2, n = re.subn(r"\sdata-ai[\w-]*\s*=\s*[\"'][^\"']*[\"']", "", out, flags=re.I)
    if n:
        actions.append(f"drop data-ai* attributes x{n}")
        out = out2
    if not actions:
        actions.append("no HTML AI meta removed")
    return out, actions


def inspect_svg(data: bytes) -> tuple[bool, bool, list[str], dict]:
    findings: list[str] = []
    has_c2pa, has_ai, hits = _blob_hits(data)
    findings.extend(hits)
    try:
        text = data.decode("utf-8", errors="replace")
        if re.search(r"<metadata[\s>]", text, re.I):
            findings.append("svg <metadata> present")
            has_ai = True
        if re.search(r"xmpmeta|rdf:RDF|contentcredentials", text, re.I):
            has_ai = True
            findings.append("XMP/RDF-like content in SVG")
        if re.search(r"c2pa|jumbf", text, re.I):
            has_c2pa = True
    except Exception as e:
        findings.append(f"svg decode note: {e}")
    return has_c2pa, has_ai or has_c2pa, findings, {}


def clean_svg(data: bytes) -> tuple[bytes, list[str]]:
    actions: list[str] = []
    text = data.decode("utf-8", errors="surrogateescape")
    new, n = re.subn(r"<metadata\b[^>]*>.*?</metadata\s*>", "", text, flags=re.I | re.DOTALL)
    if n:
        actions.append(f"drop <metadata> x{n}")
        text = new
    new, n = re.subn(r"<x:xmpmeta\b[^>]*>.*?</x:xmpmeta\s*>", "", text, flags=re.I | re.DOTALL)
    if n:
        actions.append(f"drop xmpmeta x{n}")
        text = new

    def _cmt(m: re.Match[str]) -> str:
        body = m.group(0)
        if AI_META_NAME_RE.search(body):
            actions.append("drop SVG comment with AI markers")
            return ""
        return body

    text = re.sub(r"<!--.*?-->", _cmt, text, flags=re.DOTALL)
    if not actions:
        new, n = re.subn(
            r'\s(inkscape:version|sodipodi:docname|generator)\s*=\s*"[^"]*"',
            "",
            text,
            flags=re.I,
        )
        if n:
            actions.append(f"drop generator-like attrs x{n}")
            text = new
    if not actions:
        actions.append("no SVG metadata removed")
    return text.encode("utf-8", errors="surrogateescape"), actions


def _blob_hits(blob: bytes) -> tuple[bool, bool, list[str]]:
    lower = blob.lower()
    findings: list[str] = []
    has_c2pa = False
    has_ai = False
    for n in C2PA_MARKERS:
        if n.lower() in lower:
            has_c2pa = True
            findings.append(f"marker:{n.decode('ascii', errors='replace')}")
    for n in AI_META_HINTS:
        if n.lower() in lower:
            has_ai = True
            label = n.decode("ascii", errors="replace")
            if label not in {f.split(":", 1)[-1] for f in findings}:
                findings.append(f"ai:{label}")
    return has_c2pa, has_ai or has_c2pa, findings[:30]