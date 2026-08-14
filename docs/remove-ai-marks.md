# remove-ai-marks

A local, stdlib-only skill for cleaning AI provenance marks from user-owned files. Detects and strips **invisible Unicode**, **C2PA / EXIF / XMP metadata**, and reduces **statistical text watermarks** via an optional, always-offered rewrite pass.

> Intended for your own content (privacy hygiene, redistribution you hold rights to). Never presented as proof of human authorship — Layer B honesty note is always emitted.

## Layout

```
skills/remove-ai-marks/
├── SKILL.md                 # agent entry point (workflow + prompts)
├── scripts/                 # Python stdlib implementation
│   ├── inspect_file.py      # CLI: classify + inspect (human or --json)
│   ├── clean_file.py        # CLI: clean to .cleaned suffix / --in-place / --json
│   └── … (common, text_unicode, image_meta, container_text,
│          container_zip, container_meta, file_router, rewrite_text)
└── references/             # mark classes, matrix, vendor notes, ethics, Claude notes
tests/remove_ai_marks/      # stdlib unittest suite (74 tests)
```

## Usage

```bash
# venv interpreter on this repo (Windows)
PY=venv\Scripts\python.exe
SK=skills/remove-ai-marks/scripts

# inspect first
$PY $SK/inspect_file.py --json notes.md

# deterministic metadata / Unicode clean
$PY $SK/clean_file.py notes.md -o notes.cleaned.md
$PY $SK/clean_file.py shot.png   -o shot.cleaned.png
$PY $SK/clean_file.py deck.docx  -o deck.cleaned.docx

# Layer B (statistical marks) — print-only prompt (no model call)
$PY $SK/rewrite_text.py notes.md --backend print-prompt --strength paraphrase
# or a local Ollama backend (loopback only by default)
set WATERMARKS_REWRITE_BACKEND=ollama
set WATERMARKS_REWRITE_MODEL=llama3.2
set WATERMARKS_REWRITE_BASE_URL=http://127.0.0.1:11434
$PY $SK/rewrite_text.py notes.md -o notes.rewritten.md
```

Remote rewrite endpoints are denied by default; opt in with `WATERMARKS_REWRITE_ALLOW_REMOTE=1` + `WATERMARKS_REWRITE_API_KEY` (env only, never argv). Never passes keys in argv; paints JSON/HTML before printing to stdout.

## What it removes

| Class | Files | Detail |
| --- | --- | --- |
| Unicode controls | txt, md, code, html… | ZWSP/bidi/tags/variation selectors/exotic spaces (`text_unicode.py`) |
| C2PA / JUMBF | PNG (`caBX`, `jumb`), JPEG (APP11/`0xEB`) | `image_meta.py` |
| EXIF / XMP | PNG, JPEG | `exiftool`/`c2patool` used when installed |
| Doc containers | DOCX, ODT | `docProps/*`, `customXml/*`, `meta:generator` (`container_zip.py`) |
| Web/text wrappers | SVG, HTML, MD | `<xmpmeta>`, `<meta generator>`, JSON-LD, frontmatter keys (`container_text.py`) |
| PDF | PDF | exiftool preferred; stdlib XMP strip best-effort |

Binaries are never fed to text cleaners (`guard_binary`, `SystemExit(2)`). Originals are never overwritten without `--in-place`, which first writes `<name>.bak`. Atomic writes via temp file + `os.replace`.

## Verification

`--json` returns `{kind, input, output, detected, removed, remaining, verification, note}`. `verification` is `passed|partial|failed` based on post-clean re-inspection; `note` carries **"Best effort — cannot guarantee complete removal."** whenever a residual is possible but not provable.

## Tests

```bash
venv\Scripts\python.exe -m unittest discover -s tests/remove_ai_marks -t .   # 74 tests
npm run test:remove-ai-marks
```

No pytest required. Fixture builders are in-memory (`fixtures_builder.py`); nothing touches the network or real files on disk except the temp dir under `base.py`.

## Dependencies & constraints

- Python 3.13 stdlib only (no pip packages).
- Optional external tools auto-detected on PATH: `c2patool`, `exiftool` (PDF cleaning strongly prefers exiftool).
- Windows: POSIX subprocess resource limits (`preexec_fn`) are unavailable and silently skipped; exit code 0 retained.
- Files capped at 256 MB input / 64 MB stdin; all scripts stay under 500 lines.

## Out of scope

Pixel/audio/video watermarks (SynthID image, StegaStamp), C2PA **soft binding** (re-links to a remote manifest after strip), secret-key or backdoor-trained detector marks.