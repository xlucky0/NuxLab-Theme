"""Verify package architecture metadata parsing and enforcement."""

import importlib.util
from pathlib import Path
import tempfile
import unittest

SCRIPT = Path(__file__).resolve().parents[1] / '.github/scripts/check_apk_architecture.py'
SPEC = importlib.util.spec_from_file_location('apk_architecture', SCRIPT)
CHECK = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(CHECK)


class ApkArchitectureTests(unittest.TestCase):
    def test_accepts_architecture_independent_metadata(self):
        for architecture in ['noarch', 'all']:
            with self.subTest(architecture=architecture):
                dump = f'info:\n  name: luci-theme-nuxlab\n  arch: {architecture}\n'
                self.assertEqual(CHECK.verify_architecture(dump), architecture)

    def test_rejects_missing_duplicate_or_device_specific_architecture(self):
        for dump in [
            'info:\n  name: luci-theme-nuxlab\n',
            'info:\n  arch: noarch\n  arch: x86_64\n',
            'info:\n  arch: x86_64\n',
        ]:
            with self.subTest(dump=dump), self.assertRaises(ValueError):
                CHECK.verify_architecture(dump)

    def test_empty_package_directory_is_rejected(self):
        with tempfile.TemporaryDirectory() as temporary:
            with self.assertRaisesRegex(ValueError, 'No APK'):
                CHECK.verify(Path(temporary), 'apk')


if __name__ == '__main__':
    unittest.main()
