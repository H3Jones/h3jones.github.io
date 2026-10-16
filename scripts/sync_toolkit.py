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
import shutil
import subprocess
import sys
from pathlib import Path

SITE_ROOT = Path(__file__).resolve().parent.parent
DEST = SITE_ROOT / "tools" / "ms-toolkit"


def find_package(path: Path) -> Path:
    for candidate in (path, path / "packages" / "ms-toolkit"):
        if (candidate / "package.json").is_file() and (candidate / "src").is_dir():
            return candidate
    sys.exit(f"error: no ms-toolkit package found at {path}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--toolkit", default=os.environ.get("MS_TOOLKIT_PATH"))
    parser.add_argument("--build", action="store_true", help="run `npm run build` first")
    args = parser.parse_args()
    if not args.toolkit:
        sys.exit("error: pass --toolkit or set MS_TOOLKIT_PATH")

    package = find_package(Path(args.toolkit).expanduser().resolve())

    if args.build:
        npm = shutil.which("npm") or sys.exit("error: npm not found")
        subprocess.run([npm, "run", "build"], cwd=package, check=True)

    dist = package / "dist"
    scripts = sorted(dist.glob("*.js")) + sorted((dist / "assets").glob("*.js"))
    if not scripts:
        sys.exit(f"error: no built files in {dist}; run with --build")

    if DEST.exists():
        shutil.rmtree(DEST)
    for src in scripts:
        target = DEST / src.relative_to(dist)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, target)

    # The worker must be referenced relatively (vite `base: './'`).
    for core in DEST.glob("core-*.js"):
        if '"/assets/' in core.read_text(encoding="utf-8"):
            sys.exit(f"error: {core.name} uses a root-relative worker path; set base './' in the toolkit")

    print(f"Synced {len(scripts)} files from {dist} to {DEST.relative_to(SITE_ROOT)}")
    print("Next: commit tools/. GitHub Actions renders and publishes when merged to master.")


if __name__ == "__main__":
    main()
