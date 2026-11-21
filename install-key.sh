#!/bin/sh
set -eu

if [ "$#" -ne 1 ]; then
	printf 'Usage: %s <expected-public-key-sha256>\n' "$0" >&2
	exit 2
fi

expected="$(printf '%s' "$1" | tr 'A-F' 'a-f')"
case "$expected" in
	*[!0-9a-f]*|'')
		printf 'Expected SHA256 must be 64 hexadecimal characters.\n' >&2
		exit 2
		;;
esac
if [ "${#expected}" -ne 64 ]; then
	printf 'Expected SHA256 must be 64 hexadecimal characters.\n' >&2
	exit 2
fi

umask 077
mkdir -p /etc/apk/keys
temporary="/etc/apk/keys/.nuxlab-apk.pem.$$"
trap 'rm -f "$temporary"' EXIT HUP INT TERM
wget -qO "$temporary" \
	https://github.com/xlucky0/NuxLab-Theme/releases/latest/download/nuxlab-apk.pem

actual="$(sha256sum "$temporary" | awk '{print $1}')"
if [ "$actual" != "$expected" ]; then
	printf 'Public key fingerprint mismatch (expected %s, got %s).\n' "$expected" "$actual" >&2
	exit 1
fi

chmod 0644 "$temporary"
mv "$temporary" /etc/apk/keys/nuxlab-apk.pem
trap - EXIT HUP INT TERM
printf 'Installed /etc/apk/keys/nuxlab-apk.pem (SHA256 %s).\n' "$actual"
