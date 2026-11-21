#!/bin/sh
set -eu

if [ "$#" -ne 3 ]; then
	printf 'Usage: %s <packages-directory> <rootfs-tarball> <platform>\n' "$0" >&2
	exit 2
fi

packages="$(cd "$1" && pwd)"
rootfs="$(cd "$(dirname "$2")" && pwd)/$(basename "$2")"
platform="$3"
temporary="$(mktemp -d)"
image="nuxlab-apk-test:$(printf '%s' "$platform" | tr '/:' '--')"
trap 'docker image rm "$image" >/dev/null 2>&1 || true; rm -rf "$temporary"' EXIT HUP INT TERM
umask 077

openssl ecparam -name prime256v1 -genkey -noout -out "$temporary/wrong-key.pem"
openssl ec -in "$temporary/wrong-key.pem" -pubout -out "$temporary/wrong-key.pub" 2>/dev/null
docker import --platform "$platform" "$rootfs" "$image" >/dev/null

run_case() {
	case_name="$1"
	docker run --rm --platform "$platform" \
		-e "NUXLAB_TEST_CASE=$case_name" \
		-v "$packages:/packages:ro" \
		-v "$temporary/wrong-key.pub:/wrong-key.pub:ro" \
		"$image" /bin/ash -s <<'OPENWRT'
set -eu

theme="$(find /packages -maxdepth 1 -type f -name 'luci-theme-nuxlab-*.apk' | head -n 1)"
[ -n "$theme" ] || { echo 'Missing theme package' >&2; exit 1; }

expect_untrusted() {
	if output="$(apk add "$theme" 2>&1)"; then
		printf '%s\n' "$output"
		echo 'Expected APK signature verification to fail.' >&2
		exit 1
	fi
	printf '%s\n' "$output"
	printf '%s\n' "$output" | grep -qi 'UNTRUSTED' || {
		echo 'APK install failed without an UNTRUSTED signature diagnostic.' >&2
		exit 1
	}
}

check_trusted_output() {
	output="$1"
	printf '%s\n' "$output"
	if printf '%s\n' "$output" | grep -qi 'UNTRUSTED'; then
		echo 'Trusted installation emitted an UNTRUSTED warning.' >&2
		exit 1
	fi
}

case "$NUXLAB_TEST_CASE" in
	no-key)
		expect_untrusted
		;;
	wrong-key)
		mkdir -p /etc/apk/keys
		cp /wrong-key.pub /etc/apk/keys/nuxlab-wrong.pem
		expect_untrusted
		;;
	local)
		mkdir -p /etc/apk/keys
		cp /packages/nuxlab-apk.pem /etc/apk/keys/nuxlab-apk.pem
		output="$(apk add "$theme" 2>&1)" || {
			printf '%s\n' "$output"
			exit 1
		}
		check_trusted_output "$output"
		;;
	feed)
		mkdir -p /etc/apk/keys /etc/apk/repositories.d
		cp /packages/nuxlab-apk.pem /etc/apk/keys/nuxlab-apk.pem
		printf '%s\n' 'file:///packages' > /etc/apk/repositories.d/nuxlab.list
		output="$(apk update 2>&1)" || {
			printf '%s\n' "$output"
			exit 1
		}
		check_trusted_output "$output"
		output="$(apk add luci-theme-nuxlab 2>&1)" || {
			printf '%s\n' "$output"
			exit 1
		}
		check_trusted_output "$output"
		;;
	*)
		echo "Unknown test case: $NUXLAB_TEST_CASE" >&2
		exit 2
		;;
esac
OPENWRT
}

run_case no-key
run_case wrong-key
run_case local
run_case feed
