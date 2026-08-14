"""Shared helpers for remove-ai-marks tests (stdlib unittest).

Mirrors the real skill workflow for every case:
    original -> inspect -> clean -> inspect -> verify
"""

from __future__ import annotations

import sys
import tempfile
import unittest
from pathlib import Path

TESTS_DIR = Path(__file__).resolve().parent
REPO_ROOT = TESTS_DIR.parents[1]
SCRIPTS = REPO_ROOT / "skills" / "remove-ai-marks" / "scripts"
sys.path.insert(0, str(SCRIPTS))

from common import safe_write_bytes  # noqa: E402
from file_router import clean_file, classify, inspect_file  # noqa: E402


def run_clean(tmp: Path, data: bytes, name: str = "input", **kwargs) -> dict:
    src = tmp / f"{name}.bin"
    out = tmp / f"{name}.cleaned"
    safe_write_bytes(str(src), data)
    report = clean_file(src, output=out, **kwargs)
    return report


class RemoveAiMarksBase(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.tmp = Path(self._tmp.name)

    def tearDown(self) -> None:
        self._tmp.cleanup()

    def write(self, name: str, data: bytes) -> Path:
        p = self.tmp / name
        p.parent.mkdir(parents=True, exist_ok=True)
        safe_write_bytes(str(p), data)
        return p

    def verify_cleaned(self, report: dict) -> None:
        self.assertNotIn("remaining_findings_error", report)
        remaining = report.get("remaining") or []
        self.assertEqual(remaining, [], f"residual findings: {remaining}")

    def assert_report_roundtrip(self, report: dict) -> None:
        self.assertIn("input", report)
        self.assertIn("output", report)
        self.assertIn("detected", report)
        self.assertIn("removed", report)
        self.assertIn("remaining", report)
        self.assertIn("verification", report)


if __name__ == "__main__":
    unittest.main()