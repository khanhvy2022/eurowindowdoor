#!/usr/bin/env python3
"""Unified clean: text Layer A, PNG/JPEG metadata, and document containers.

Usage:
    python scripts/clean_file.py <path> [-o OUTPUT] [--json] [--in-place]
"""

from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from file_router import main_clean  # noqa: E402

if __name__ == "__main__":
    raise SystemExit(main_clean())