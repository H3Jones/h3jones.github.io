#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# ///
"""Vendor the built ms-toolkit web components into tools/ms-toolkit/.

Usage:
    uv run scripts/sync_toolkit.py [--toolkit PATH] [--build]

PATH is the MassSpecToolkit repo root (or the packages/ms-toolkit folder).
Defaults to the MS_TOOLKIT_PATH environment variable.
"""

import argparse
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parent.parent
DEST = SITE_ROOT / "tools" / "ms-toolkit"
ENTRY_POINTS = ("ion-calculator.mjs", "mass-split.mjs")
DECLARATION_SUFFIXES = (".d.ts", ".d.mts", ".d.cts")
IMPORT_SPECIFIER = re.compile(
    r"""(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["']([^"']+)["']"""
)
SOURCE_URL = re.compile(r"""new URL\(\s*["'][^"']+\.ts["']""")
ROOT_URL = re.compile(r"""new URL\(\s*["']/""")


def find_package(path: Path) -> Path:
    for candidate in (path, path / "packages" / "ms-toolkit"):
        if (candidate / "package.json").is_file() and (candidate / "src").is_dir():
            return candidate
    sys.exit(f"error: no ms-toolkit package found at {path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--toolkit", default=os.environ.get("MS_TOOLKIT_PATH"))
    parser.add_argument(
        "--build",
        action="store_true",
        help="build the toolkit package and browser distribution first",
    )
    args = parser.parse_args()
    if not args.toolkit:
        sys.exit("error: pass --toolkit or set MS_TOOLKIT_PATH")

    package = find_package(Path(args.toolkit).expanduser().resolve())

    if args.build:
        npm = shutil.which("npm") or sys.exit("error: npm not found")
        subprocess.run([npm, "run", "build"], cwd=package, check=True)
        subprocess.run([npm, "run", "build:browser"], cwd=package, check=True)

    dist = package / "dist" / "browser"
    files = sorted(
        path
        for path in dist.rglob("*")
        if path.is_file() and not path.name.endswith(DECLARATION_SUFFIXES)
    )
    if not files:
        sys.exit(f"error: no browser distribution found in {dist}; run with --build")

    missing = [entry for entry in ENTRY_POINTS if not (dist / entry).is_file()]
    if missing:
        sys.exit(f"error: missing browser entry point(s) in {dist}: {', '.join(missing)}")

    for src in files:
        if src.suffix not in (".js", ".mjs"):
            continue
        content = src.read_text(encoding="utf-8")
        for specifier in IMPORT_SPECIFIER.findall(content):
            if not specifier.startswith("."):
                sys.exit(f"error: {src.name} has unresolved bare import {specifier!r}")
        if SOURCE_URL.search(content) or ROOT_URL.search(content):
            sys.exit(f"error: {src.name} contains a source or root-relative asset URL")

    if DEST.exists():
        shutil.rmtree(DEST)
    for src in files:
        target = DEST / src.relative_to(dist)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, target)

    print(f"Synced {len(files)} files from {dist} to {DEST.relative_to(SITE_ROOT)}")
    print("Next: commit tools/. GitHub Actions renders and publishes when merged to master.")


if __name__ == "__main__":
    main()
