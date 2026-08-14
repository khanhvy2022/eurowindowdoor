"""Tests for Layer B rewrite backend selection and security posture.

No network calls are made: print-prompt is default, and non-loopback URLs are
refused unless explicitly opted in.
"""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

TESTS_DIR = Path(__file__).resolve().parent
REPO_ROOT = TESTS_DIR.parents[1]
SCRIPTS = REPO_ROOT / "skills" / "remove-ai-marks" / "scripts"
sys.path.insert(0, str(SCRIPTS))

import rewrite_text as rt  # noqa: E402
from rewrite_text import _check_remote, build_prompt, rewrite  # noqa: E402


class TestPrompts(unittest.TestCase):
    def test_paraphrase_prompt(self):
        p = build_prompt("paraphrase", "It was a good day.")
        self.assertIn("It was a good day.", p)
        self.assertIn("Output only the rewritten text", p)

    def test_unknown_strength_raises(self):
        with self.assertRaises(ValueError):
            build_prompt("nope", "x")


class TestRemoteGuard(unittest.TestCase):
    def test_loopback_allowed(self):
        _check_remote("http://127.0.0.1:11434", allow_remote=False)  # no raise
        _check_remote("http://localhost:8000", allow_remote=False)

    def test_remote_denied_by_default(self):
        with self.assertRaises(SystemExit):
            _check_remote("http://example.com/v1", allow_remote=False)

    def test_remote_allowed_when_opted_in(self):
        _check_remote("https://api.openai.com/v1", allow_remote=True)  # no raise

    def test_non_http_scheme_always_refused(self):
        with self.assertRaises(SystemExit):
            _check_remote("file:///etc/passwd", allow_remote=True)


class TestRewriteBackends(unittest.TestCase):
    def test_print_prompt_default(self):
        out, info = rewrite(
            "The quick brown fox",
            backend="print-prompt",
            model=None,
            base_url=None,
            api_key=None,
            strength="paraphrase",
            lang="French",
            original_lang="English",
            timeout=10,
            layer_a_after=False,
            temperature=0.9,
            candidates=1,
            allow_remote=False,
        )
        self.assertEqual(info["mode"], "print-prompt")
        self.assertIn("The quick brown fox", out)

    def test_gemini_requires_key(self):
        with self.assertRaises(SystemExit):
            rewrite(
                "x",
                backend="gemini",
                model="gemini-2.0-flash",
                base_url=None,
                api_key=None,
                strength="paraphrase",
                lang="",
                original_lang="",
                timeout=10,
                layer_a_after=False,
                temperature=0.9,
                candidates=1,
                allow_remote=True,
            )

    def test_ollama_requires_model(self):
        with self.assertRaises(SystemExit):
            rewrite(
                "x",
                backend="ollama",
                model=None,
                base_url="http://127.0.0.1:11434",
                api_key=None,
                strength="paraphrase",
                lang="",
                original_lang="",
                timeout=10,
                layer_a_after=False,
                temperature=0.9,
                candidates=1,
                allow_remote=False,
            )

    def test_qwen_remote_refused_default(self):
        with self.assertRaises(SystemExit):
            rewrite(
                "x",
                backend="qwen",
                model="qwen2.5:7b",
                base_url="http://example.com:8000",
                api_key=None,
                strength="paraphrase",
                lang="",
                original_lang="",
                timeout=10,
                layer_a_after=False,
                temperature=0.9,
                candidates=1,
                allow_remote=False,
            )


class TestCandidateSelection(unittest.TestCase):
    def test_selects_more_divergent(self):
        a = "The cat sat on the mat and looked at the sun."
        b = "Every dog ran fast across the empty yard chasing birds."
        best, scores = rt._select_candidate(a, [a, b])
        self.assertEqual(best, b)
        self.assertGreater(scores[1], scores[0])

    def test_length_guard_penalizes_bloat(self):
        a = "The cat sat."
        bloat = "The cat sat silently while waiting quietly all through the very long morning."
        _, scores = rt._select_candidate(a, [bloat])
        self.assertEqual(len(scores), 1)
        # bloat expands >2x length so its score is reduced below raw divergence
        raw = rt._lexical_divergence(a, bloat)
        self.assertLess(scores[0], raw)

    def test_length_guard_still_prefers_more_divergent(self):
        a = "The cat sat quietly outside."
        bloat = "The cat sat quietly outside patiently waiting the entire day long."
        alt = "Birds flew fast over the empty field chasing food."
        best, scores = rt._select_candidate(a, [bloat, alt])
        self.assertEqual(best, alt)
        self.assertGreater(scores[1], scores[0])


if __name__ == "__main__":
    unittest.main()