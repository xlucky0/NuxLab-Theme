# Developing NuxLab 3.0

[简体中文](DEVELOPMENT_ZH.md) · [README](../README.md)

## Build with OpenWrt

From an OpenWrt build tree:

```sh
cd package
git clone https://github.com/xlucky0/NuxLab-Theme.git luci-theme-nuxlab
cd ..
make menuconfig
# LuCI → Themes → luci-theme-nuxlab
make package/luci-theme-nuxlab/compile V=s
```

Theme settings are included. Select the nested `compat/luci-app-nuxlab` package under LuCI applications only when building the migration package. Existing translation names remain `luci-i18n-nuxlab-*`.

Firmware and GitHub Actions build scripts should stop cloning the old standalone `luci-app-nuxlab` repository and deselect that plugin. The old `1.0-r20261008` plugin duplicates the configuration, RPC services, settings page and icons now owned by the theme, causing APK's `trying to overwrite ... owned by luci-theme-nuxlab` errors. New firmware only needs the theme. If the old package name is required, use this repository's empty migration package and keep exactly one definition of that package in the build tree. The migration package has no theme dependency so it can be installed first to hand off the old files before installing the theme. After updating an existing build tree, run `make defconfig` and clean the old plugin's build outputs before rebuilding.

The older `does not support ucode template precompilation` log line is LuCI's skip message, separate from the file conflict. This package disables precompilation and ships `.ut` source to avoid SDK/target ucode bytecode incompatibilities; other LuCI packages can retain precompilation.

Release CI builds signed APK v3 packages with the OpenWrt 25.12.5 SDK and uploads the theme, migration and translation APKs, signed `packages.adb`, `nuxlab-apk.pem`, and `install-key.sh` to each GitHub Release. The signed packages and index are also published under `/feed/` on GitHub Pages. The SDK's `apk adbsign` path rewrites an existing APK in place and has been observed to corrupt packages, so CI signs packages at creation time with the verified `apk mkpkg --sign-key` option instead; the index uses `apk mkndx --sign-key`. The public/private pair must match. OPKG/IPK packages and usign signing are not currently published. Ucode templates ship as source to avoid tying packages to one runtime's bytecode format.

Pull requests also build the theme with the same OpenWrt SDK and attach `nuxlab-theme-preview-unsigned` for seven days. It is an unsigned test artifact only; use a tagged release for signed packages and never treat the preview APK as trusted.

Translations use `PKG_PO_VERSION` to follow the theme release, including `-r<revision>` for APK. CI reads each translation APK's internal package metadata and blocks artifact upload and publication if the version is wrong.

### Release signing

Create a P-256 key pair on a trusted maintainer machine:

```sh
openssl ecparam -name prime256v1 -genkey -noout -out key.pem
openssl ec -in key.pem -pubout -out pub.pem
```

Save the complete PEM contents as Actions secrets `OPENWRT_PRIV_KEY` and `OPENWRT_PUB_KEY` at **Settings → Secrets and variables → Actions**. Never commit, print, or attach the private key. CI uses a restrictive umask, deletes temporary key files, and checks that the public and private keys match before signing. Because the SDK's safe package-creation signing is used, trusted package build scripts in the tagged release run in the same job as the signing key; protect release-tag creation and review release code before tagging. Keep the public-key SHA256 fingerprint in the release notes; the released `install-key.sh` verifies that fingerprint before installing `/etc/apk/keys/nuxlab-apk.pem`.

Router setup after comparing the fingerprint with the release notes:

```sh
wget -qO /tmp/install-key.sh https://github.com/xlucky0/NuxLab-Theme/releases/latest/download/install-key.sh && sh /tmp/install-key.sh <SHA256-from-release-notes>
```

Install a local signed package, or use the signed static feed:

```sh
apk add ./luci-theme-nuxlab-*.apk
printf '%s\n' 'https://xlucky0.github.io/NuxLab-Theme/feed' \
  > /etc/apk/repositories.d/customfeeds.list
apk update && apk add luci-theme-nuxlab
```

For legacy-package migration, install both signed packages from the feed after configuring the key:

```sh
apk update && apk add luci-theme-nuxlab luci-app-nuxlab
```

The Release workflow verifies local and feed installation, rejection without a key and with a different key, and the `noarch` package metadata on official OpenWrt 25.12.5 x86_64 and aarch64 root filesystems. It does not automate LuCI's **System → Software → Upload Package** dialog; verify that interaction manually on an OpenWrt 25.12 device after installing the key. If the private key is lost or exposed, rotate it and have users install the replacement public key before updating. An APK P-256 key cannot be used with `usign`; a future IPK workflow would require a separately generated usign key and secrets, and is currently disabled/not implemented.

Visual settings are stored in UCI: `fx_mode` accepts `full`, `saver` or `off`; `rgb_mode` accepts `0` or `1`; `rgb_speed` accepts `off`, `slow`, `normal` or `fast` (30/14/6-second hue cycles for slow/normal/fast); `preset` accepts `aurora`, `cyber` or `mono`. For example:

```sh
uci set nuxlab.@global[0].fx_mode='saver'
uci set nuxlab.@global[0].rgb_mode='1'
uci set nuxlab.@global[0].rgb_speed='fast'
uci set nuxlab.@global[0].preset='aurora'
uci commit nuxlab
```

Reduced-motion preference disables FX; low-memory, low-core or slow-frame devices fall back to saver. Browser profiling and LuCI upload are hardware/browser dependent and are not represented as automated CI results.

## Source map

| Location | Responsibility |
| --- | --- |
| `less/cascade.less` | Style entry point and import order |
| `less/theme.less` | Light/dark palette and semantic color tokens |
| `less/spacing.less`, `less/shape.less` | Spacing and corner tokens |
| `less/components/` | Shared controls, tables, tabs, dialogs and appearance menu |
| `less/pages/`, `less/page-fix.less` | LuCI/plugin adaptations and their import index |
| `less/responsive.less` | Viewport adaptations |
| `htdocs/luci-static/nuxlab/` | Compiled CSS, images, fonts and SVG icons |
| `htdocs/luci-static/resources/` | Theme settings and LuCI JavaScript modules |
| `ucode/template/themes/nuxlab/` | Login and application templates |
| `root/` | UCI defaults, RPC services, ACLs and integration files |
| `po/` | NuxLab Config translations |
| `tests/` | Behavior and integration checks |

## Styles

Edit LESS sources, then regenerate the committed stylesheet:

```sh
npm ci
npm run build:css
npm test
```

Light and dark modes share this one stylesheet. Each `@theme-palette` row in `theme.less` defines `role: light, dark;`; one value means both modes share it. Use semantic tokens for text, surfaces, borders and states. Legacy variable aliases exist for LuCI compatibility.

Imports run from tokens and base controls through login/application layout, shared components, page adaptations, and responsive rules. Add common behavior to its component module; keep plugin selectors in `pages/`. The `page-fix.less` file is an import index.

Maintain page/card insets and section, field, control and action gaps through spacing tokens. Small screens reduce outer and card insets to `1rem`. Keep long labels wrapping and let form controls shrink to their containers. Escape native CSS `min()` expressions when LESS would evaluate them prematurely.

Corner tokens cover labels, controls, panels, cards and dialogs. Keep the inside edges of joined controls square. Avoid clipping entire cards: dropdowns and tooltips can extend beyond them. Tables handle their own final-row corners and narrow-screen layout.

Preserve native LuCI structures and interactions. Tab bars join their following content containers; section content owns its vertical spacing. Modal actions wrap or stack as space requires, and long content scrolls through the overlay. Dropdown positioning and scrolling remain controlled by LuCI. Restrict hover effects to hover-capable devices and respect reduced motion.

## Templates

LuCI's `header`, `header_login`, `out_header_login`, `sysauth` and footer entry points remain available.

| Template | Responsibility |
| --- | --- |
| `head.ut` | Validated settings, metadata, styles and conditional application resources |
| `sysauth.ut` | Login layout and shared template assembly |
| `login_background.ut` | Wallpaper selection and image/video output |
| `login_form.ut` | Authentication fields, messages and plugin content |
| `page_scripts.ut` | Scripts shared by the footer entry points |

Pass local values through the second argument of `include`. Login pages do not load application LuCI modules. Only `classic` and `centered` are accepted as `login_style`; unknown values fall back to `classic`.

## Configuration and branding

Settings stay in `/etc/config/nuxlab`; the settings route remains `/admin/system/nuxlab`. Fresh installs use local backgrounds, classic login, 10px blur and 0.5 panel opacity. Existing options survive upgrades.

New installations derive dark colors from the primary seed. Existing explicit dark colors stay custom. Dark login glass settings can inherit the light values or keep independent overrides. Switching back to automatic/inherited settings retains custom values for later use.

The header appearance menu saves only its mode through `luci.nuxlab_appearance`. The preference is device-wide and requires NuxLab write access. Keep this independent from pending form settings; failed saves reconcile with the stored mode.

Uploaded branding lives in `/www/luci-static/nuxlab/branding/`; backgrounds live in `/www/luci-static/nuxlab/background/`. Upload/reset operations apply immediately. Branding does not replace packaged images, and both directories are included in configuration-preserving upgrade backups. The browser icon also supplies the touch icon and manifest; existing home-screen shortcuts may need to be added again.

## Menu icons

Top-level menu nodes resolve `htdocs/luci-static/nuxlab/icon/<node-name>.svg`, independently of translated titles. Filenames are case-sensitive and accept letters, digits, underscores and hyphens. Missing icons use `default.svg`.

Use monochrome SVGs with a `viewBox` and transparent background. CSS masks supply theme and interaction colors. Shared chevrons use the same 24×24 grid and 2px round strokes. See the [icon index](../htdocs/luci-static/nuxlab/icon/README.md) for available assets. This mechanism is separate from uploaded browser icons and login logos.

## Static update feed deployment

The router reads a static `/updates/stable.json` manifest without calling the GitHub API. After publication, CI uses its own `GITHUB_TOKEN` to retrieve the official release, verifies theme and translation package SHA256 digests and sizes, and generates one artifact. GitHub Pages publishes that artifact directly; Cloudflare Pages deploys the same files from a dedicated `updates` Git branch. Packages continue to download from the pinned GitHub Release. The installer includes matching packages for existing NuxLab translations and the configured LuCI language when available.

Initial maintainer setup:

1. Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. Allow the default branch and release tags in the `github-pages` environment. The workflow needs `contents: write` to publish the `updates` branch.
2. Once this code is on the default branch, manually run **Publish update feeds**. This initializes GitHub Pages and creates the `updates` branch from the latest stable release, without publishing a new version or requiring CF setup first.
3. Create a Cloudflare Pages **Git integration** project connected to this GitHub repository. Set production branch to `updates`, framework to **None**, build command to `exit 0`, output directory to `.`, and preview branches to **None**. Use the assigned `pages.dev` hostname or your own domain. Existing Direct Upload projects need to be replaced with a new Git integration project.
4. Set these repository **Variables** under **Settings → Secrets and variables → Actions**:

   | Variable | Value |
   | --- | --- |
   | `NUXLAB_UPDATE_PRIMARY_URL` | Complete URL, e.g. `https://<assigned-hostname>/updates/stable.json` |
   | `NUXLAB_UPDATES_ENABLED` | `true` to synchronize after stable releases |
   | `NUXLAB_UPDATE_FALLBACK_URL` | Optional; defaults to `https://xlucky0.github.io/NuxLab-Theme/updates/stable.json`. Override for a custom fallback domain. |

5. Choose how CF is triggered. By default, keep automatic production branch deployments enabled: pushing `updates` triggers CF without a CF secret in GitHub. For Deploy Hooks, create a hook bound to `updates` under CF **Settings → Builds → Add deploy hook**. Save the complete URL as the GitHub repository Actions **Secret** `CF_PAGES_DEPLOY_HOOK`, then disable **Enable automatic production branch deployments** to avoid building each publication twice.
6. Compare `/updates/stable.json` on both hosts byte for byte. Verify primary access, fallback access and actual package downloads from the target router's network. New release packages embed the configured source URLs; changing repository variables does not change themes already installed on devices.

`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_PAGES_PROJECT` are no longer used. The Hook URL contains its own trigger credential and belongs in a Secret. A successful Hook response means CF accepted the build request; check Pages for the actual deployment result.

Only successful stable publications update the feed. Previews are excluded, and a delayed old-release job skips publication when its tag is no longer Latest. The `updates` branch contains generated static files, preserves commit history and rejects conflicting pushes. The publisher refuses to overwrite an existing unrelated branch with that name.

Run **Publish update feeds** again to republish GitHub Pages. Identical artifacts do not create another branch commit. With a Hook configured, reruns still trigger CF when the branch is unchanged, allowing failed deployments to be retried. With Git auto-deployment only, retry the build in CF or publish changed feed content. Both publication jobs are independent, so either side can publish if the other fails.

The manifest contains `schema`, `repository`, `tag`, `published_at`, `notes`, and the APK filename with `_sha256`/`_size` fields. Metadata comes from the published package bytes rather than the default branch's Makefile. The package must match the release tag. Malformed feeds trigger fallback and never overwrite the previous successful cache. Checks are manual, with a five-minute success cache, a one-minute failure cooldown and a lock that coalesces concurrent requests.

Schema 1 also supports an optional `translations` object keyed by language package suffix, such as `zh-cn`. Each entry has the same six package fields for both formats. Names must match the theme's release, each translation is limited to 1 MiB, and at most 32 languages are accepted. Existing translations without verified metadata disable automatic installation. All required packages are downloaded and verified before the package manager runs; storage checks use their combined size, and completion requires the expected installed versions. The theme's pre-install hook and UCI initialization preserve bundled catalogs across a first upgrade made by an older updater, without replacing catalogs already supplied by independent language packages.

Source builds default to an empty CF primary. Configure one before packaging:

```sh
python3 .github/scripts/generate_update_site.py sources \
  --primary 'https://YOUR_DOMAIN/updates/stable.json' \
  --output root/usr/share/nuxlab/update-sources.json
```

Sources must be complete HTTPS URLs without credentials, ports, query strings or fragments. Runtime sources live in `/usr/share/nuxlab/update-sources.json`, which is updated by theme packages separately from `/etc/config/nuxlab`. The installer constructs fixed official release download URLs; manifests cannot supply arbitrary download URLs.

References: [Cloudflare GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/), [Deploy Hooks](https://developers.cloudflare.com/pages/configuration/deploy-hooks/), [branch deployment controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/), [custom GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Checks

Use Node.js 22+, Python 3, LESS 4.1.3 and a Ucode build matching the supported OpenWrt runtime:

```sh
UCODE_BIN=/path/to/ucode sh .github/scripts/check_theme.sh
```

The script checks JavaScript, shell and Ucode syntax, verifies compiled CSS against LESS, and runs the Node/Python tests. CI's Ucode build is defined in [check.yml](../.github/workflows/check.yml).

For UI changes, check the actual affected LuCI pages in light/dark modes and desktop/mobile widths, including keyboard focus, long text and reduced motion where relevant. Network and hardware behavior still needs a suitable OpenWrt environment.

Include Firefox ESR 115, 128, 140 and 153 when checking login and theme settings. Leave browser feature preferences at their defaults. `nuxlab-compat.js` supplies DOM markers for joined controls and dropdown table sections only when native `:has()` is unavailable; use forgiving `:is()` lists to keep those fallback selectors valid. Keep new browser API use feature-detected, and avoid unsupported selectors in JavaScript queries. The fallback covers common theme controls; plugin-specific layouts need their own checks.
