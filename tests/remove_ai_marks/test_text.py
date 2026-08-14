"""Tests for Layer A text Unicode scrub (before -> inspect -> clean -> inspect -> verify)."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from base import RemoveAiMarksBase, run_clean
from file_router import clean_file
from fixtures_builder import TEXT_FIXTURES
from text_unicode import clean_text, inspect_text


class TestTextInspect(unittest.TestCase):
    def test_inspect_finds_zwsp(self):
        report = inspect_text(TEXT_FIXTURES["zwsp"])
        self.assertGreaterEqual(report.suspicious_total, 2)
        kinds = {h.kind for h in report.hits}
        self.assertTrue(kinds & {"zwj_family", "strip"})

    def test_inspect_bidi(self):
        report = inspect_text(TEXT_FIXTURES["bidi"])
        self.assertTrue(any(h.kind == "bidi" for h in report.hits))

    def test_inspect_tag_chars(self):
        report = inspect_text(TEXT_FIXTURES["tag"])
        self.assertTrue(any(h.kind == "tag_chars" for h in report.hits))

    def test_inspect_exotic_spaces(self):
        report = inspect_text(TEXT_FIXTURES["exotic_spaces"])
        self.assertGreaterEqual(report.suspicious_total, 3)
        self.assertTrue(any(h.kind == "space" for h in report.hits))

    def test_clean_text_preserves_normal(self):
        raw = TEXT_FIXTURES["clean"]
        cleaned, stats = clean_text(raw)
        self.assertEqual(cleaned, raw)
        self.assertEqual(stats["removed_count"], 0)

    def test_emojis_not_suspicious(self):
        report = inspect_text(TEXT_FIXTURES["emoji"])
        self.assertEqual(report.suspicious_total, 0)

    def test_aggressive_confusable(self):
        cleaned, _ = clean_text("p\u0430y", aggressive_homoglyphs=True)
        self.assertEqual(cleaned, "pay")


class TestTextCleanEndToEnd(RemoveAiMarksBase):
    def test_zwsp_cleaned_via_router(self):
        report = run_clean(self.tmp, TEXT_FIXTURES["zwsp"].encode("utf-8"), name="zwsp")
        self.assert_report_roundtrip(report)
        self.assertEqual(report["kind"], "text")
        self.assertEqual(report["verification"], "passed")
        self.verify_cleaned(report)
        out = self.tmp / "zwsp.cleaned"
        self.assertEqual(out.read_text(encoding="utf-8"), "HelloWorld!")

    def test_bidi_cleaned_via_router(self):
        report = run_clean(self.tmp, TEXT_FIXTURES["bidi"].encode("utf-8"), name="bidi")
        self.assertEqual(report["verification"], "passed")
        self.verify_cleaned(report)

    def test_tag_chars_cleaned_via_router(self):
        report = run_clean(self.tmp, TEXT_FIXTURES["tag"].encode("utf-8"), name="tag")
        self.assertEqual(report["verification"], "passed")
        out = self.tmp / "tag.cleaned"
        self.assertNotIn(chr(0xE0041), out.read_text(encoding="utf-8"))

    def test_exotic_spaces_replaced(self):
        report = run_clean(self.tmp, TEXT_FIXTURES["exotic_spaces"].encode("utf-8"), name="spaces")
        self.assertEqual(report["verification"], "passed")
        out = self.tmp / "spaces.cleaned"
        self.assertEqual(out.read_text(encoding="utf-8").replace("\n", ""), "a b c d")

    def test_clean_normal_unchanged(self):
        report = run_clean(self.tmp, TEXT_FIXTURES["clean"].encode("utf-8"), name="norm")
        self.assertEqual(report["verification"], "passed")
        out = self.tmp / "norm.cleaned"
        self.assertEqual(out.read_text(encoding="utf-8"), TEXT_FIXTURES["clean"])

    def test_original_untouched(self):
        src = self.tmp / "orig.txt"
        src.write_text(TEXT_FIXTURES["zwsp"], encoding="utf-8")
        before = src.read_bytes()
        clean_file(src, output=self.tmp / "cleaned.txt")
        self.assertEqual(src.read_bytes(), before)


if __name__ == "__main__":
    unittest.main()