# Mark classes

Marks this skill addresses are grouped by how they are stored and removed. Confidence buckets in reports: `confirmed`, `probable`, `informational`, `likely_false_positive`.

## 1. Unicode / format controls (Layer A — deterministic removal)

Invisible or near-invisible codepoints embedded in text as steganography carriers or broken-paste artifacts.

- **Zero-width family** — ZWSP `U+200B`, ZWNJ `U+200C`, ZWJ `U+200D`, word joiner `U+2060`, BOM/ZWNBSP `U+FEFF`, Mongolian vowel separator `U+180E`. Carriers for bit-packed hidden payloads.
- **Bidi controls** — LRM/RLM `U+200E/F`, LRE/RLE/PDF/LRO/RLO `U+202A–E`, LRI/RLI/FSI/PDI `U+2066–9`, ALM `U+061C`. Spoofing/obfuscation.
- **Tag characters** — `U+E0001–U+E007F`. Some stego schemes pack bits here.
- **Variation selectors** — `U+FE00–F`, `U+E0100–E01EF`. Invisible presentation glue.
- **Exotic spaces** — NBSP `U+00A0`, EM space `U+2003`, ideographic space `U+3000`, etc. Homoglyphs for U+0020.
- **Other format (`Cf`)** — leftover `Cf` category codepoints.

Removal: `clean_text` strips `strip`/`bidi`/`tag_chars`/`variation_selector`/`zwj_family` codepoints and replaces exotic spaces with ASCII space. Emoji glue (ZWJ, VS15/16) after an emoji base is preserved so visible emoji sequences stay intact.

## 2. Statistical (token-sampling) watermarks — Layer B (best-effort rewrite)

Embedded in word choice / token distribution, not in a fixed codepoint set. Examples: SynthID text variants, OpenAI provenance-ish sampling biases, LLM-vendor token priors.

Removal: paraphrase / humanize / back-translate / structural rewrite via `rewrite_text.py`. **Cannot be gold-verified** without vendor detectors/keys.

## 3. Metadata / provenance structures — file containers

- **C2PA / Content Credentials** — JUMBF manifests in PNG (`caBX`, `c2pa*`, `jumb` chunks) or JPEG APP11 (`0xEB`). `confirmed` findings.
- **EXIF** — standard image metadata; a camera EXIF block is *not* AI provenance, but AI tools often write `Software=Claude` or similar.
- **XMP** — `xmpmeta`/RDF packets in images, SVG, PDF; `digitalSourceType: trainedAlgorithmicMedia` is the canonical AI signal.
- **DOCX/ODT** — `docProps/*` (core/app/custom), `customXml/*`, `meta:generator`.
- **HTML/Markdown** — `<meta name="generator">`, JSON-LD provenance blocks, `data-ai-*` attributes, YAML frontmatter keys (`generator`, `ai_generated`, …).

## Out of scope

- Pixel-domain image watermarks (StegaStamp, Tree-Ring, StableSignature) and audio/video watermarks — not removable by this skill.
- **C2PA soft binding** — a content watermark that re-links to a remote manifest even after metadata strip.
- Secret-key / trained-backdoor detector marks.
