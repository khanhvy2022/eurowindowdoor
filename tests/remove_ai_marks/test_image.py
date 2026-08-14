"""Tests for PNG/JPEG C2PA/EXIF/XMP metadata detection and strip."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from base import RemoveAiMarksBase
from file_router import clean_file
from fixtures_builder import build_jpeg, build_png
from image_meta import detect_format, inspect_image, inspect_jpeg, inspect_png


class TestPngInspect(unittest.TestCase):
    def test_clean_png_has_no_ai(self):
        data = build_png()
        has_c2pa, has_ai, findings = inspect_png(data)
        self.assertFalse(has_c2pa)
        self.assertFalse(has_ai)
        self.assertEqual(findings, [])

    def test_c2pa_png_detected(self):
        has_c2pa, has_ai, _ = inspect_png(build_png(with_c2pa=True))
        self.assertTrue(has_c2pa)
        self.assertTrue(has_ai)

    def test_exif_png_detected(self):
        has_c2pa, has_ai, _ = inspect_png(build_png(with_exif=True))
        self.assertFalse(has_c2pa)
        self.assertTrue(has_ai)

    def test_xmp_text_detected(self):
        has_c2pa, has_ai, findings = inspect_png(build_png(with_xmp_text=True))
        self.assertTrue(has_ai)
        self.assertTrue(any("digitalSourceType" in f for f in findings))

    def test_detect_format(self):
        self.assertEqual(detect_format(build_png()), "png")
        self.assertEqual(detect_format(build_jpeg()), "jpeg")


class TestJpegInspect(unittest.TestCase):
    def test_clean_jpeg_has_no_ai(self):
        has_c2pa, has_ai, findings = inspect_jpeg(build_jpeg())
        self.assertFalse(has_c2pa)
        self.assertFalse(has_ai)

    def test_c2pa_jpeg_detected(self):
        has_c2pa, has_ai, _ = inspect_jpeg(build_jpeg(with_c2pa=True))
        self.assertTrue(has_c2pa)

    def test_exif_jpeg_detected(self):
        has_c2pa, has_ai, _ = inspect_jpeg(build_jpeg(with_exif=True))
        self.assertFalse(has_c2pa)
        self.assertTrue(has_ai)

    def test_xmp_jpeg_detected(self):
        has_c2pa, has_ai, _ = inspect_jpeg(build_jpeg(with_xmp=True))
        self.assertTrue(has_ai)


class TestImageCleanEndToEnd(RemoveAiMarksBase):
    def _assert_image_clean(self, name: str, data: bytes) -> None:
        src = self.write(f"{name}.png", data)
        rep = inspect_image(src)
        self.assertTrue(
            rep.has_c2pa or rep.has_ai_metadata,
            f"fixture {name} should carry a detectable signal",
        )
        out = self.tmp / f"{name}.cleaned.png"
        report = self._clean(src, out)
        self.assert_report_roundtrip(report)
        self.assertEqual(report["verification"], "passed")
        self.verify_cleaned(report)

    def _clean(self, src, out):
        return clean_file(src, output=out)

    def test_png_c2pa_cleaned(self):
        self._assert_image_clean("c2pa", build_png(with_c2pa=True))

    def test_png_exif_cleaned(self):
        self._assert_image_clean("exif", build_png(with_exif=True))

    def test_png_xmp_cleaned(self):
        self._assert_image_clean("xmp", build_png(with_xmp_text=True))

    def test_jpeg_c2pa_cleaned(self):
        self._assert_image_clean("jc2pa", build_jpeg(with_c2pa=True))

    def test_jpeg_exif_cleaned(self):
        self._assert_image_clean("jexif", build_jpeg(with_exif=True))

    def test_jpeg_xmp_cleaned(self):
        self._assert_image_clean("jxmp", build_jpeg(with_xmp=True))

    def test_clean_image_keeps_pixels(self):
        """PNG alone must remain decodable after chunk strip."""
        src = self.write("keep.png", build_png(with_c2pa=True))
        out = self.tmp / "keep.cleaned.png"
        clean_file(src, output=out)
        cleaned = out.read_bytes()
        self.assertEqual(cleaned[:8], b"\x89PNG\r\n\x1a\n")
        # IEND chunk (length+name) must still be present at the end.
        self.assertIn(b"\x00\x00\x00\x00IEND", cleaned)
        # IHDR is not dropped by the strip.
        self.assertIn(b"IHDR", cleaned)


if __name__ == "__main__":
    unittest.main()