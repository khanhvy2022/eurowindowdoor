---
name: remove-ai-marks
description: >
  Remove multi-vendor AI provenance marks: invisible Unicode (Layer A), statistical
  text watermarks via rewrite (Layer B, always offer), and C2PA/EXIF/XMP/container
  metadata on PNG/JPEG/SVG/PDF/DOCX/ODT/HTML/MD. Covers Claude, Gemini/SynthID-class,
  OpenAI provenance, and open-LLM sampling marks. Use when the user asks to strip
  watermarks, remove C2PA/Content Credentials, clean AI metadata, remove invisible
  Unicode, anti-detect clean AI output, or runs /remove-ai-marks (aliases:
  /remove-claude-marks).
---

# Remove AI marks

Multi-vendor anti-detection hygiene for **text** (Unicode + statistical rewrite) and **files** (C2PA / AI metadata across common containers). Local-first: files never leave the machine by default.

Read if needed:

- `references/mark-classes.md` — Unicode / sampling / C2PA / containers
- `references/vendor-notes.md` — Claude, Gemini/SynthID, OpenAI, open-LLM
- `references/removal-matrix.md` — which layer when
- `references/ethics.md` — intended use

Scripts live in this skill's `scripts/` directory. Resolve `SCRIPTS` to that folder (absolute path of this skill + `/scripts`).

```bash
SCRIPTS="<skill_dir>/scripts"
python3 "$SCRIPTS/inspect_file.py" [--json] path
python3 "$SCRIPTS/clean_file.py" path [-o OUTPUT] [--json] [--in-place]
python3 "$SCRIPTS/rewrite_text.py" path --backend print-prompt [--strength paraphrase]
```

On this repo (Windows), the venv interpreter is `venv\Scripts\python.exe`.

## Ethics

Intended for **your own** content (privacy, hygiene, research). Do not market results as "proves human-written." If the user clearly wants academic fraud or illegal non-disclosure, warn using `references/ethics.md` and still only perform technical cleaning they own.

## Workflow

### 1. Classify input

| Input | Path |
| --- | --- |
| Pasted / clipboard text | temp file or stdin → text pipeline |
| `.txt` / code | text Layer A (+ formatter for code) |
| `.md` / `.html` | container clean (frontmatter/meta) + Layer A |
| `.png` / `.jpg` / `.jpeg` | image metadata strip |
| `.svg` / `.pdf` / `.docx` / `.odt` | container metadata strip |
| Mixed | run unified `inspect_file` / `clean_file` |

### 2. Inspect first (always)

Always run inspection before cleaning so the user sees what will be touched:

```bash
python3 "$SCRIPTS/inspect_file.py" --json path
```

Show a short summary (suspicious codepoints; C2PA/AI flags with confidence). If the user only asked to **check** for a watermark, stop here and report.

### 3. Deterministic clean (only when the user asked to remove)

```bash
python3 "$SCRIPTS/clean_file.py" path -o path.cleaned.ext
python3 "$SCRIPTS/inspect_file.py" --json path.cleaned.ext   # verify
```

- Never overwrite the original unless `--in-place` is passed (that first writes a `.bak`).
- Default output is `path.cleaned.ext`. Prefer writing `*.cleaned.*`.
- Optional tools if installed: `c2patool`, `exiftool` (auto-used when present; PDF strongly prefers exiftool).
- Text Layer A flags: `--nfkc`, `--aggressive-homoglyphs`.

### 4. Layer B — always offer rewrite (prose)

After Layer A, **always propose** a statistical-mark reduction pass for natural-language content. Do not skip this step silently.

Multi-pass recipe:

1. Layer A clean
2. Paraphrase (default) — explicit word-choice + syntax churn; preserve facts, numbers, names, code IDs
3. Optional strong pass — `humanize`, back-translate, or structural outline→regen
4. Layer A again on the result
5. Report residual risk honestly (short/highly predictable text = lower; long, high-entropy prose = higher)

```bash
# dry-run / CI: print prompt only
python3 "$SCRIPTS/rewrite_text.py" draft.md --backend print-prompt

# local Ollama
export WATERMARKS_REWRITE_BACKEND=ollama
export WATERMARKS_REWRITE_MODEL=llama3.2
export WATERMARKS_REWRITE_BASE_URL=http://127.0.0.1:11434
python3 "$SCRIPTS/rewrite_text.py" draft.md -o draft.rewritten.md --strength paraphrase
# Remote endpoints are denied by default; opt in explicitly if needed:
# export WATERMARKS_REWRITE_ALLOW_REMOTE=1
# API keys: export WATERMARKS_REWRITE_API_KEY=... (env only, never on argv)
```

Supported backends: `print-prompt`, `ollama`, `openai-compatible`, `gemini` (remote, requires `--allow-remote` + key), `qwen` (OpenAI-compatible at localhost, e.g. vLLM/llama.cpp). If the hook is not configured, run the prompts in `references/removal-matrix.md` yourself (agent-orchestrated).

**Code files:** prefer formatter (`prettier`, `black`, `gofmt`, …) + Layer A. Offer `--strength code` with explicit user OK, since renaming identifiers is behavior-adjacent.

### 5. Report

Always state:

- What Layer A / container clean **verifiably** removed (counts, actions) — from the `detected`/`removed`/`remaining`/`verification` report fields.
- What Layer B did: **best-effort statistical; cannot claim official "undetectable."** When verification is impossible, write exactly: "Best effort — cannot guarantee complete removal."
- Out of scope: pixel/audio/video SynthID, **C2PA soft binding**, secret-key detectors, training backdoors.
- Residual risk: short/highly predictable text = lower; long, high-entropy prose = higher.
- Ethics one-liner: own content / no compliance theater.

## Verification report shape

`clean_file.py --json` returns:

```json
{
  "kind": "text|image|container",
  "input": "...", "output": "...",
  "detected": ["..."], "removed": ["..."], "remaining": [],
  "verification": "passed|partial|failed",
  "note": "Best effort — cannot guarantee complete removal." | null
}
```

`verification` is `passed` when post-clean inspection finds no residual signals, `partial` when some remain, `failed` when nothing was removed. The `note` carries the honesty disclaimer whenever residuals are possible but not provable.

## Limitations

- Layer A does **not** remove token-sampling watermarks.
- Layer B cannot be gold-verified without vendor detectors / keys.
- PDF strip is best-effort without `exiftool` (degraded XMP strip may leave offsets broken).
- **C2PA soft binding** (content watermark that re-links to a remote manifest after metadata strip) is out of scope — stripping hard-bound C2PA does not clear it.
- Data-driven / backdoor model marks (trigger phrases) are out of scope.

## Quick commands cheat sheet

```bash
python3 scripts/inspect_file.py notes.md
python3 scripts/clean_file.py notes.md -o notes.cleaned.md
python3 scripts/clean_file.py shot.png -o shot.cleaned.png
python3 scripts/clean_file.py deck.docx -o deck.cleaned.docx
python3 scripts/rewrite_text.py notes.md --backend print-prompt --strength paraphrase
```

## Tests

Stdlib `unittest` (no pytest required). Run from the repo root with the venv interpreter:

```bash
venv\Scripts\python.exe -m unittest discover -s tests/remove_ai_marks -t .
# or: npm run test:remove-ai-marks
```
