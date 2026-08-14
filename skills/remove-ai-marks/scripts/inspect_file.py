#!/usr/bin/env python3
"""Unified inspect: text, images (PNG/JPEG), and containers (SVG/PDF/DOCX/ODT/HTML/MD).

Usage:
    python scripts/inspect_file.py [--json] <path>
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from file_router import main_inspect  # noqa: E402

if __name__ == "__main__":
    raise SystemExit(main_inspect())