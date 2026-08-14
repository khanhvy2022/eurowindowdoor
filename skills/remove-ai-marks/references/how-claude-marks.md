# How Claude marks content

What actually leaks as "made by Claude" in a file, checked by inspection in order of fragility.

## 1. Statistical (token-level) — most common

Claude's generation is not a single fixed secret watermark you can grep for. The detectable signal is in *token distribution*: which synonyms, transition words, sentence rhythms, and structure appear. Tools that "detect AI" primarily train on this class. There is no Unicode codepoint or header block to remove; the only lever is a meaning-preserving rewrite (Layer B).

Short, constrained, or highly predictable output (boilerplate, single words) has little exploitable signal either way.

## 2. Template / attribution text — removable, don't delete real content

Claude sometimes emits signature phrases in prose. Where they are genuine attribution ("As an AI language model…"), removing them may be desirable for your own copy. But terminal blocks, license headers, and tool metadata you didn't ask for are separate. Do not strip a license or required attribution.

## 3. File metadata — deterministic, container-level

- **DOCX:** `docProps/core.xml` (`dc:creator`, `cp:lastModifiedBy`, `Application`), `docProps/app.xml`, `docProps/custom.xml`; `customXml/*` parts can hold tool-specific provenance.
- **ODT:** `meta.xml` `meta:generator` / `dc:creator`.
- **PNG/JPEG:** C2PA/Content Credentials chunks (`caBX` / APP11) written by products like Claude's script-export / Artifacts; XMP `x:xmpmeta` with `dc:creator` or `digitalSourceType`.
- **SVG/HTML/MD:** `generator` meta/frontmatter, `data-ai-*` attributes, JSON-LD blocks.

## Honest framing

A clean CLI report differs from a detector's guess. We report `verification: passed|partial|failed` from what *we* can inspect, and append "Best effort — cannot guarantee complete removal." whenever a residual is possible but unprovable.