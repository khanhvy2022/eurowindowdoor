# Vendor notes

How each vendor family typically marks content, so inspection targets the right signal.

## Claude (Anthropic)

- **Text:** no public invisible-Unicode watermark at the time of writing; marks are statistical/token-level. Layer B rewrite is the relevant pass.
- **Metadata:** DOCX `docProps/core.xml` `dc:creator` / `Application` fields can read `Claude`; XMP may carry `generator`/`creator` values.
- **Code:** a marker may appear in comments; a formatter + Layer A usually suffices.

## Gemini / SynthID-class

- **Images:** SynthID watermark is pixel-domain (out of scope for removal); metadata C2PA/Content Credentials (JPEG APP11 / PNG `caBX`) is removable.
- **Text:** SynthID text watermarks are statistical — Layer B.
- `digitalSourceType: trainedAlgorithmicMedia` and `compositeWithTrainedAlgorithmicMedia` are the XMP/IPTC fields to look for.

## OpenAI

- **Text:** sampling-based provenance (statistical). Layer B.
- **Metadata:** C2PA/Content Credentials in images; `data-ai-*` attributes and `<meta name="generator" content="ChatGPT">` in HTML; JSON-LD provenance blocks.

## Open-LLM (Llama, Mistral, Qwen, DeepSeek, …)

- Sampling priors create statistical signatures — Layer B.
- Qwen served via vLLM/llama.cpp/Ollama is reachable through `rewrite_text.py` `openai-compatible` or `qwen` backend at loopback.

## Detection caveat

`c2pa` / `ContentCredentials` strings can occur in compressed image streams by chance (byte-scan false positives). `inspect_file.py` labels these `likely_false_positive`; `confirmed` is reserved for parsed provenance structures.