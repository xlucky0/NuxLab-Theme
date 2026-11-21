#!/usr/bin/env python3
"""Verify that every published NuxLab APK is architecture independent."""

import argparse
from pathlib import Path
import re
import subprocess


def apk_architecture(dump):
    matches = re.findall(r"^  arch: (\S+)\s*$", dump, re.M)
    if len(matches) != 1:
        raise ValueError(f"Expected exactly one package architecture field, found {len(matches)}")
    return matches[0]


def verify_architecture(dump):
    architecture = apk_architecture(dump)
    if architecture not in {"noarch", "all"}:
        raise ValueError(f"Expected noarch/all, got {architecture}")
    return architecture


def verify(directory, apk_tool):
    packages = sorted(directory.glob("*.apk"))
    if not packages:
        raise ValueError(f"No APK packages found in {directory}")
    for package in packages:
        if package.is_symlink() or not package.is_file():
            raise ValueError(f"Not a regular APK file: {package.name}")
        result = subprocess.run([apk_tool, "adbdump", str(package)],
                                capture_output=True, text=True, check=True)
        try:
            architecture = verify_architecture(result.stdout)
        except ValueError as error:
            raise ValueError(f"{package.name}: {error}") from error
        print(f"Verified architecture: {package.name} ({architecture})")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--directory", type=Path, required=True)
    parser.add_argument("--apk-tool", default="apk")
    args = parser.parse_args()
    try:
        verify(args.directory, args.apk_tool)
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"::error::APK architecture verification failed: {error}\n")


if __name__ == "__main__":
    main()
