"""Tests for the file router: classification, binary guard, report shape."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from base import RemoveAiMarksBase
from file_router import classify, inspect_file
from fixtures_builder import build_docx, build_markdown, build_pdf, build_png


class TestClassify(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = __import__("tempfile").TemporaryDirectory()

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def _write(self, name: str, data: bytes) -> None:
        from pathlib import Path

        (Path(self._tmp.name) / name).write_bytes(data)

    def test_by_extension(self):
        from pathlib import Path

        self.assertEqual(classify(Path("a.png")), "image")
        self.assertEqual(classify(Path("a.jpg")), "image")
        self.assertEqual(classify(Path("a.docx")), "container")
        self.assertEqual(classify(Path("a.md")), "container")
        self.assertEqual(classify(Path("a.txt")), "text")
        self.assertEqual(classify(Path("a.py")), "text")

    def test_by_magic_unknown_ext(self):
        from pathlib import Path

        dirpath = Path(self._tmp.name)
        (dirpath / "magic.png").write_bytes(build_png(with_c2pa=True))
        (dirpath / "magic.bin").write_bytes(b"\x89PNG\r\n\x1a\n" + b"\x00" * 24)
        self.assertEqual(classify(dirpath / "magic.bin"), "image")

    def test_container_magic_zip(self):
        from pathlib import Path

        dirpath = Path(self._tmp.name)
        (dirpath / "doc.bin").write_bytes(build_docx())
        self.assertEqual(classify(dirpath / "doc.bin"), "container")


class TestInspectReportShape(RemoveAiMarksBase):
    def test_text_report_shape(self):
        src = self.write("t.txt", "hello".encode())
        rep = inspect_file(src)
        self.assertEqual(rep["kind"], "text")
        self.assertIn("length", rep)
        self.assertIn("suspicious_total", rep)
        self.assertIn("hits", rep)

    def test_image_report_shape(self):
        src = self.write("i.png", build_png(with_c2pa=True))
        rep = inspect_file(src)
        self.assertEqual(rep["kind"], "image")
        self.assertIn("format", rep)
        self.assertIn("has_c2pa", rep)
        self.assertTrue(rep["has_c2pa"])

    def test_container_report_shape(self):
        src = self.write("c.md", build_markdown(ai_generator=True))
        rep = inspect_file(src)
        self.assertEqual(rep["kind"], "container")
        self.assertIn("format", rep)
        self.assertTrue(rep["has_ai_metadata"])


class TestBinaryGuard(RemoveAiMarksBase):
    def test_pdf_bytes_classified_as_container_not_corrupted(self):
        """PDF passed to clean must route to container, never to text scrub."""
        from file_router import clean_file

        src = self.write("g.pdf", build_pdf())
        out = self.tmp / "g.cleaned.pdf"
        report = clean_file(src, output=out)
        self.assertEqual(report["kind"], "container")
        self.assertEqual(report["format"], "pdf")

    def test_text_clean_refuses_png_bytes(self):
        from file_router import clean_file

        src = self.write("fake.txt", build_png())
        out = self.tmp / "fake.cleaned.txt"
        with self.assertRaises(SystemExit) as ctx:
            clean_file(src, output=out, force_type="text")
        self.assertEqual(ctx.exception.code, 2)
        self.assertFalse(out.exists())


if __name__ == "__main__":
    unittest.main()