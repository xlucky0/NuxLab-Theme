#!/bin/sh
set -eu

cd "$(dirname "$0")/../.."

tmpdir="$(mktemp -d)"
trap 'rm -rf "$tmpdir"' EXIT HUP INT TERM

find htdocs/luci-static/resources -type f -name '*.js' -print |
	while IFS= read -r script; do node --check "$script"; done
for script in root/etc/uci-defaults/* root/usr/libexec/rpcd/*; do
	sh -n "$script"
done

ucode_bin="${UCODE_BIN:-ucode}"
for template in ucode/template/themes/nuxlab/*.ut; do
	"$ucode_bin" -T, -s -cno-interp,dynlink=fs,dynlink=uci,dynlink=luci.core,dynlink=luci.nuxlab-branding,dynlink=luci.nuxlab-palette \
		-o "$tmpdir/$(basename "$template").uc" "$template"
done
# Compile an importing entry point: stable ucode has no standalone module flag.
"$ucode_bin" -L "$(dirname "$ucode_bin")/*.so" -L "$PWD/root/usr/share/ucode/*.uc" -cno-interp,dynlink=fs \
	-o "$tmpdir/nuxlab-branding.uc" -e 'import { get_branding } from "luci.nuxlab-branding";'
"$ucode_bin" -L "$(dirname "$ucode_bin")/*.so" -L "$PWD/root/usr/share/ucode/*.uc" -cno-interp,dynlink=math \
	-o "$tmpdir/nuxlab-palette.uc" -e 'import { dark_palette } from "luci.nuxlab-palette";'

lessc less/cascade.less "$tmpdir/cascade.css"
cmp htdocs/luci-static/nuxlab/css/cascade.css "$tmpdir/cascade.css"
lessc less/fx.less "$tmpdir/fx.css"
fx_bytes=$(( $(wc -c < "$tmpdir/fx.css") + $(wc -c < htdocs/luci-static/resources/nuxlab-fx.js) ))
if [ "$fx_bytes" -gt 61440 ]; then
	echo "FX CSS and JavaScript exceed the 60 KiB budget: ${fx_bytes} bytes." >&2
	exit 1
fi
echo "FX CSS and JavaScript: ${fx_bytes} bytes (60 KiB maximum)."

UCODE_BIN="$ucode_bin" npm test
