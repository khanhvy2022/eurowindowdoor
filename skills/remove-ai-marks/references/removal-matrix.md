# Removal matrix

Which layer to apply, and when. The guiding rule: **inspect first, then clean what the user asked to clean, then verify and report honestly.**

| Input | Layer A (Unicode) | Container meta (C2PA/EXIF/XMP) | Layer B (rewrite) |
| --- | --- | --- | --- |
| Pasted text / `.txt` | always | — | prose: always offer; code: only with user OK |
| `.md` / `.mdx` | yes (via container clean) | frontmatter keys (`generator`, `ai_generated`, …) | offer |
| `.html` / `.htm` | yes | `<meta generator>`, JSON-LD provenance, `data-ai-*` | offer |
| `.png` / `.jpg` / `.jpeg` | — | C2PA chunks / APP11, EXIF, XMP | — |
| `.svg` | — | `<metadata>`, `x:xmpmeta`, generator attrs | — |
| `.pdf` | — | EXIF via exiftool preferred; XMP strip is best-effort | — |
| `.docx` / `.odt` | — | `docProps/*`, `customXml/*`, `meta:generator` | — |
| Code (`.py` `.ts` `.js` …) | yes | — | `--strength code` only with user OK |

## Strengths for Layer B (`rewrite_text.py --strength`)

1. `paraphrase` (default) — token-level word + syntax churn, preserves facts/numbers/names.
2. `humanize` — natural-human prose, removes formulaic transitions.
3. `backtranslate` — meaning-preserving two-hop translation (pivot language).
4. `structural` — outline → regenerate (strongest, highest risk of drift).
5. `code` — comments/docstrings/string literals + local identifier renames.

## Residual risk

- Short / highly predictable text → lower residual risk. A single phrase like "The cat sat" has few valid paraphrases.
- Long, high-entropy prose → higher. Statistical detectors on long text are more reliable than on short.
- After Layer A only: statistical watermarks remain, by definition.

## Report honestly

- When post-clean inspection shows no residual signal: `verification: "passed"`.
- When residuals are possible but unprovable (statistical marks, soft binding, no PDF exiftool): write exactly **"Best effort — cannot guarantee complete removal."**