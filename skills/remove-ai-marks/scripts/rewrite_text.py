#!/usr/bin/env python3
"""Layer B optional rewrite hook for statistical (token-sampling) watermarks.

Backends:
  print-prompt       — emit prompt only (default; CI-safe, no model)
  ollama             — POST to Ollama /api/chat
  openai-compatible  — POST to OpenAI-style /v1/chat/completions
  gemini             — POST to Google AI Studio GenerateContent (remote opt-in)
  qwen               — OpenAI-compatible Qwen (vLLM / llama.cpp at localhost)

Env (optional):
  WATERMARKS_REWRITE_BACKEND
  WATERMARKS_REWRITE_BASE_URL
  WATERMARKS_REWRITE_MODEL
  WATERMARKS_REWRITE_API_KEY      (env-only; never pass keys on argv)
  WATERMARKS_REWRITE_ALLOW_REMOTE (set to 1 to allow non-loopback endpoints)

Security notes:
  - Only http(s) endpoints are accepted; redirects are refused so an
    Authorization header (API key) can never be re-sent to an unvalidated host.
  - Non-loopback endpoints are denied unless WATERMARKS_REWRITE_ALLOW_REMOTE=1
    (or --allow-remote) is set explicitly.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))

from common import cleaned_path, eprint, read_text_input, write_text_output  # noqa: E402
from text_unicode import clean_text  # noqa: E402

PROMPTS = {
    "paraphrase": (
        "Rewrite the following text so that it uses substantially different wording at "
        "the token level. Change clause order, connectors, and transition words; vary "
        "sentence boundaries and length; and replace both content words and function "
        "words where meaning allows. Preserve all facts, numbers, names, and technical "
        "identifiers. Do not add or remove claims. Output only the rewritten text.\n\n---\n{TEXT}"
    ),
    "humanize": (
        "Rewrite the following text so it reads as if a human wrote it from scratch. "
        "Vary sentence rhythm and length, replace formulaic AI-style transitions and "
        "filler with concrete natural phrasing, and use plain, varied wording. Preserve "
        "all facts, numbers, names, and technical identifiers. Do not add or remove "
        "claims. Output only the rewritten text.\n\n---\n{TEXT}"
    ),
    "code": (
        "Rewrite the natural-language parts of this code — comments, docstrings, and "
        "string literals — using different wording. Rename local variables, function "
        "parameters, and private helper names to semantically equivalent names. Preserve "
        "program behavior, public API names, and all values that affect output. Output "
        "only the rewritten code.\n\n---\n{TEXT}"
    ),
}

_LOOPBACK_HOSTS = frozenset({"localhost", "127.0.0.1", "::1", "0.0.0.0"})

DEFAULT_BASE_URLS = {
    "ollama": "http://127.0.0.1:11434",
    "openai-compatible": "http://127.0.0.1:8000",
    "qwen": "http://127.0.0.1:8000",
}

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"


def _env(name: str, default: str | None = None) -> str | None:
    v = os.environ.get(name)
    if v is None or v == "":
        return default
    return v


def _flag_env(name: str) -> bool:
    return os.environ.get(name, "").strip().lower() in ("1", "true", "yes", "on")


def _tokens(text: str) -> list[str]:
    return re.findall(r"[A-Za-z0-9]+", text.lower())


def _bigrams(tokens: list[str]) -> set[tuple[str, str]]:
    return set(zip(tokens, tokens[1:]))


def _lexical_divergence(original: str, candidate: str) -> float:
    a = _tokens(original)
    b = _tokens(candidate)
    if not a and not b:
        return 0.0
    if not a or not b:
        return 1.0
    ba = _bigrams(a)
    bb = _bigrams(b)
    union = ba | bb
    if not union:
        return 0.0
    return 1.0 - len(ba & bb) / len(union)


def _select_candidate(original: str, candidates: list[str]) -> tuple[str, list[float]]:
    scores: list[float] = []
    for cand in candidates:
        score = _lexical_divergence(original, cand)
        if original:
            ratio = len(cand) / len(original)
            if ratio > 2.0 or ratio < 0.5:
                score -= 0.15
        scores.append(score)
    best_idx = max(range(len(candidates)), key=lambda i: scores[i])
    return candidates[best_idx], scores


def _check_remote(base_url: str, allow_remote: bool) -> None:
    u = urlparse(base_url)
    if u.scheme not in ("http", "https"):
        raise SystemExit(f"error: rewrite base URL must be http(s), got scheme '{u.scheme}': {base_url}")
    host = u.hostname or ""
    if host in _LOOPBACK_HOSTS:
        return
    if not allow_remote:
        raise SystemExit(
            "error: rewrite base URL host is not loopback "
            f"('{host}'); refusing to send content off-machine. "
            "Set WATERMARKS_REWRITE_ALLOW_REMOTE=1 or pass --allow-remote to override."
        )
    eprint(f"warning: rewrite base URL host is '{host}' (not localhost); content will leave this machine")


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: N802
        raise urllib.error.HTTPError(req.full_url, code, msg, headers, fp)


def build_prompt(strength: str, text: str) -> str:
    if strength in PROMPTS:
        return PROMPTS[strength].format(TEXT=text)
    if strength == "backtranslate":
        return (
            "Translate the text to {LANG}, then translate that result back to "
            "{ORIGINAL_LANG}. Preserve all facts, numbers, and names. "
            "Output only the final text.\n\n---\n"
            f"{text}"
        )
    if strength == "structural":
        return (
            "First extract a bullet outline of all claims (no full sentences). "
            "Then write a complete document from that outline in natural, varied human "
            "prose without omitting any bullet. Output only the final document.\n\n---\n"
            f"{text}"
        )
    raise ValueError(f"unknown strength: {strength}")


def _http_json(url: str, payload: dict, headers: dict[str, str], timeout: float) -> dict:
    if urlparse(url).scheme not in ("http", "https"):
        raise ValueError(f"refusing non-http(s) rewrite endpoint: {url}")
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json", **headers},
        method="POST",
    )
    opener = urllib.request.build_opener(_NoRedirect())
    with opener.open(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def call_ollama(base_url: str, model: str, prompt: str, timeout: float, temperature: float) -> str:
    url = base_url.rstrip("/") + "/api/chat"
    data = _http_json(
        url,
        {
            "model": model,
            "stream": False,
            "messages": [{"role": "user", "content": prompt}],
            "options": {"temperature": temperature},
        },
        {},
        timeout,
    )
    msg = data.get("message") or {}
    content = msg.get("content")
    if not content:
        raise RuntimeError(f"ollama empty response: {data!r}"[:500])
    return str(content).strip()


def call_openai_compatible(
    base_url: str,
    model: str,
    prompt: str,
    api_key: str | None,
    timeout: float,
    temperature: float,
) -> str:
    url = base_url.rstrip("/") + "/v1/chat/completions"
    headers: dict[str, str] = {}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    data = _http_json(
        url,
        {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
        },
        headers,
        timeout,
    )
    choices = data.get("choices") or []
    if not choices:
        raise RuntimeError(f"openai-compatible empty choices: {data!r}"[:500])
    content = (choices[0].get("message") or {}).get("content")
    if not content:
        raise RuntimeError(f"openai-compatible empty content: {data!r}"[:500])
    return str(content).strip()


def call_gemini(
    model: str,
    prompt: str,
    api_key: str,
    timeout: float,
    temperature: float,
) -> str:
    url = GEMINI_URL.format(model=model)
    # Google's REST API accepts the key via the x-goog-api-key header (not the
    # query string, which could leak into server/access logs).
    data = _http_json(
        url,
        {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": temperature},
        },
        {"x-goog-api-key": api_key},
        timeout,
    )
    candidates = data.get("candidates") or []
    if not candidates:
        raise RuntimeError(f"gemini empty candidates: {data!r}"[:500])
    parts = (candidates[0].get("content") or {}).get("parts") or []
    text = "".join(p.get("text", "") for p in parts if isinstance(p, dict))
    if not text:
        raise RuntimeError(f"gemini empty content: {data!r}"[:500])
    return text.strip()


def rewrite(
    text: str,
    *,
    backend: str,
    model: str | None,
    base_url: str | None,
    api_key: str | None,
    strength: str,
    lang: str,
    original_lang: str,
    timeout: float,
    layer_a_after: bool,
    temperature: float,
    candidates: int,
    allow_remote: bool = False,
) -> tuple[str, dict]:
    prompt = build_prompt(strength, text)
    if lang and original_lang and strength == "backtranslate":
        prompt = prompt.replace("{LANG}", lang).replace("{ORIGINAL_LANG}", original_lang)
    info: dict = {
        "backend": backend,
        "strength": strength,
        "model": model,
        "base_url": base_url,
        "temperature": temperature,
        "prompt_chars": len(prompt),
        "input_chars": len(text),
    }

    if backend == "print-prompt":
        info["mode"] = "print-prompt"
        if candidates > 1:
            eprint("note: --candidates ignored in print-prompt mode")
        return prompt, info

    if backend == "gemini":
        if not model:
            raise SystemExit("error: --model required (e.g. gemini-2.0-flash)")
        if not api_key:
            raise SystemExit("error: gemini requires WATERMARKS_REWRITE_API_KEY (env-only)")
        _check_remote("https://generativelanguage.googleapis.com/", allow_remote)
        outs: list[str] = []
        for _ in range(max(1, candidates)):
            outs.append(call_gemini(model, prompt, api_key, timeout, temperature))
        out, scores = _select_candidate(text, outs) if len(outs) > 1 else (outs[0], [])
        if scores:
            info["candidate_scores"] = scores
    else:
        if not model:
            raise SystemExit("error: --model required for ollama/openai-compatible/qwen")
        if not base_url:
            raise SystemExit("error: --base-url required for ollama/openai-compatible/qwen")
        _check_remote(base_url, allow_remote)
        outs = []
        for _ in range(max(1, candidates)):
            if backend == "ollama":
                outs.append(call_ollama(base_url, model, prompt, timeout, temperature))
            elif backend in ("openai-compatible", "qwen"):
                outs.append(call_openai_compatible(base_url, model, prompt, api_key, timeout, temperature))
            else:
                raise SystemExit(f"unknown backend: {backend}")
        out, scores = _select_candidate(text, outs) if len(outs) > 1 else (outs[0], [])
        if scores:
            info["candidate_scores"] = scores

    if layer_a_after:
        out, stats = clean_text(out)
        info["layer_a_after"] = stats

    info["output_chars"] = len(out)
    info["mode"] = "rewritten"
    info["note"] = (
        "Layer B is best-effort against statistical token-sampling watermarks; "
        "cannot certify removal against a vendor detector."
    )
    return out, info


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("path", nargs="?", default="-", help="Input text file, or - for stdin")
    p.add_argument("-o", "--output", help="Output path (default: stdout or *.rewritten.*)")
    p.add_argument(
        "--backend",
        choices=("print-prompt", "ollama", "openai-compatible", "gemini", "qwen"),
        default=_env("WATERMARKS_REWRITE_BACKEND", "print-prompt"),
    )
    p.add_argument("--model", default=_env("WATERMARKS_REWRITE_MODEL"))
    p.add_argument(
        "--base-url",
        default=_env("WATERMARKS_REWRITE_BASE_URL"),
    )
    p.add_argument(
        "--allow-remote",
        action="store_true",
        default=None,
        help="Allow non-loopback rewrite endpoints (default: deny; "
        "WATERMARKS_REWRITE_ALLOW_REMOTE=1 has the same effect)",
    )
    # NOTE: no --api-key flag on purpose — keys on argv are visible in `ps`
    # and shell history. Set WATERMARKS_REWRITE_API_KEY instead.
    p.add_argument(
        "--strength",
        choices=("paraphrase", "backtranslate", "structural", "humanize", "code"),
        default="paraphrase",
    )
    p.add_argument("--lang", default="French", help="Pivot language for backtranslate")
    p.add_argument("--original-lang", default="English")
    p.add_argument("--timeout", type=float, default=120.0)
    p.add_argument("--temperature", type=float, default=0.9)
    p.add_argument("--candidates", type=int, default=1)
    p.add_argument("--no-layer-a-after", action="store_true")
    p.add_argument("--json-stats", action="store_true", help="Stats JSON on stderr")
    p.add_argument("--force-text", action="store_true")
    args = p.parse_args()

    text = read_text_input(args.path, allow_binary=args.force_text)
    allow_remote = (
        args.allow_remote if args.allow_remote is not None else _flag_env("WATERMARKS_REWRITE_ALLOW_REMOTE")
    )
    base_url = args.base_url or DEFAULT_BASE_URLS.get(args.backend)
    if args.backend == "gemini":
        base_url = "https://generativelanguage.googleapis.com/"

    try:
        result, info = rewrite(
            text,
            backend=args.backend,
            model=args.model,
            base_url=base_url,
            api_key=_env("WATERMARKS_REWRITE_API_KEY"),
            strength=args.strength,
            lang=args.lang,
            original_lang=args.original_lang,
            timeout=args.timeout,
            layer_a_after=not args.no_layer_a_after,
            temperature=args.temperature,
            candidates=args.candidates,
            allow_remote=allow_remote,
        )
    except (urllib.error.URLError, TimeoutError, RuntimeError) as e:
        eprint(f"rewrite failed: {e}")
        return 1

    out = args.output
    if out is None and args.path not in (None, "-") and args.backend != "print-prompt":
        out = str(cleaned_path(Path(args.path), suffix=".rewritten"))
    elif out is None and args.backend == "print-prompt":
        out = "-"

    write_text_output(result, out)
    if args.json_stats:
        eprint(json.dumps(info, indent=2, ensure_ascii=False))
    else:
        eprint(
            f"backend={info['backend']} strength={info['strength']} "
            f"mode={info.get('mode')} chars {info['input_chars']}->{info.get('output_chars', len(result))}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())