[license]: /LICENSE
[license-badge]: https://img.shields.io/github/license/xlucky0/luci-theme-nuxlab?style=flat-square&a=1
[prs]: https://github.com/xlucky0/luci-theme-nuxlab/pulls
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[issues]: https://github.com/xlucky0/luci-theme-nuxlab/issues/new
[issues-badge]: https://img.shields.io/badge/Issues-welcome-brightgreen.svg?style=flat-square
[release]: https://github.com/xlucky0/luci-theme-nuxlab/releases
[release-badge]: https://img.shields.io/github/v/release/xlucky0/luci-theme-nuxlab?style=flat-square
[download]: https://github.com/xlucky0/luci-theme-nuxlab/releases
[download-badge]: https://img.shields.io/github/downloads/xlucky0/luci-theme-nuxlab/total?style=flat-square
[contact]: https://t.me/jerryk6
[contact-badge]: https://img.shields.io/badge/Contact-telegram-blue?style=flat-square

<div align="center">
<img src="htdocs/luci-static/nuxlab/img/nuxlab.svg" width="96" height="96" alt="NuxLab logo" />

# NuxLab · Modern Frost & Cyberpunk Neon OpenWrt LuCI Theme

**luci-theme-nuxlab** & **luci-app-nuxlab** — A lightweight, modern OpenWrt LuCI theme featuring a frosted-indigo Day Mode and an electric **Cyberpunk Neon** Dark Mode, GPU-composited micro-animations, and customizable login backgrounds.

[![license][license-badge]][license]
[![prs][prs-badge]][prs]
[![issues][issues-badge]][issues]
[![release][release-badge]][release]
[![download][download-badge]][download]

**English** · [简体中文](README_ZH.md)

</div>

## What's new in 3.1

- **Online theme updates.** Check stable releases and install with the firmware's native APK or OPKG, preserving NuxLab settings and verifying package SHA256 and size.
- **Layout fixes.** Improve dashboard actions, overview layouts, dynamic lists and custom IP/MAC inputs across narrow screens, light/dark modes and RTL layouts.
- **Compatibility improvements.** Improve compatibility with stable OpenWrt firmware.

Users on v3.0.0 or earlier must install v3.1.3 manually once to get online updates. Users on v3.1.0 or later can upgrade through Theme updates. See the [release notes](RELEASE.md).

## 3.0 highlights

- **Built-in NuxLab Config.** Manage the theme without a separate plugin.
- **Broad third-party app support.** Refined layouts, forms and tables for most third-party LuCI apps, with desktop/mobile and light/dark adaptations.
- **Two login layouts.** Choose the classic sidebar or centered card.
- **Light and dark.** Switch from the header or follow your system, with customizable accent colors.
- **Your own look.** Adjust login glass effects, set image or video backgrounds, and upload a browser icon and login logo.
- **Desktop and mobile.** Responsive layouts across screen sizes.

## Install

**In 3.0, the theme and configuration features are one package: `luci-theme-nuxlab`. Fresh installations need only this package.** Download the format matching your firmware's native package manager from [Releases](https://github.com/xlucky0/luci-theme-nuxlab/releases). If the old standalone configuration plugin is installed, follow the migration steps below first.

| Package manager | Package | Install |
| --- | --- | --- |
| `opkg` | `.ipk` | `opkg install ./luci-theme-nuxlab_*.ipk` |
| APK v3 (`apk-tools 3.x`) | `.apk` | `apk add --allow-untrusted ./luci-theme-nuxlab-*.apk` |

Run `opkg update` or `apk update` first. APK v2 cannot read these APK packages; keep your firmware's native package manager.

For translations, install the matching `luci-i18n-nuxlab-<language>` package from the same release and in the same format.

Select **NuxLab** under **System → System → Language and Style → Design**.

<details>
<summary>Already have the old luci-app-nuxlab? Migrate to 3.0</summary>

This applies only when the old standalone configuration plugin is installed. Otherwise, skip this section.

The settings page, colors, backgrounds and branding are all included in the theme. The release's `luci-app-nuxlab` is an **empty migration package using the old package name**. It preserves existing settings and hands its files over to the theme.

1. Download both `luci-app-nuxlab` and `luci-theme-nuxlab` from the **same release in the theme repository**, in the same format.
2. Put both files in one directory on the router and open a terminal there. **Do not uninstall the old plugin first.** Choose the command pair for your firmware; run the second command only after the first succeeds.

```sh
# opkg
opkg install ./luci-app-nuxlab_*.ipk
opkg install ./luci-theme-nuxlab_*.ipk

# APK v3
apk add --allow-untrusted ./luci-app-nuxlab-*.apk
apk add --allow-untrusted ./luci-theme-nuxlab-*.apk
```

The first command replaces the old plugin with the empty migration package. The second installs the integrated theme and restores your settings. Continue configuring it under **System → NuxLab Config**.

</details>

## Customize

Open **System → NuxLab Config** for login layouts, colors, glass effects, wallpapers and branding. The header's appearance button switches between **Light mode**, **Dark mode** and **Follow system**; the choice also applies to the login page.

Local image and video backgrounds are supported, along with Bing, Unsplash and Wallhaven wallpapers. Unsplash requires an API access key. Browser icons and login logos accept PNG files, 16–1024 pixels per side, up to 1 MiB; browser icons must be square.

Under **Theme updates**, check the latest stable release, read its release notes and download the package matching your firmware's package manager.

When a newer version is available, choose **Update now** and confirm to install the theme using the firmware’s native APK or OPKG package manager, preserving your NuxLab configuration. The page shows download, verification and installation status plus installation logs, and resumes monitoring after a page refresh. Reload the page after installation. The updater downloads and verifies the theme and matching packages for your existing NuxLab translations before installing them. It also installs the configured LuCI language when that translation is available. Automatic installation requires matching release packages and SHA256 digests and does not downgrade the theme. If verified metadata is missing for an existing translation, update the theme and language packages manually from the same release.

Translations bundled into a firmware's theme package, such as KWRT's Chinese catalog, are preserved during the first upgrade to official packages, including upgrades started by an older updater. A separately installed language package can then take ownership of the catalog.

When building firmware, stop including the old standalone `luci-app-nuxlab` plugin alongside the theme: its files conflict with the integrated settings. See [Build with OpenWrt](docs/DEVELOPMENT.md#build-with-openwrt) for existing build scripts.

## Screenshots

Light and dark views of the overview and both login layouts, on desktop and mobile.

![Light mode: desktop overview, classic and centered login](Screenshots/preview-light.png)

![Mobile light mode: classic login, centered login and overview](Screenshots/mobile-light.png)

![Dark mode: desktop overview, classic and centered login](Screenshots/preview-dark.png)

![Mobile dark mode: classic login, centered login and overview](Screenshots/mobile-dark.png)

## Contributors

<a href="https://github.com/xlucky0/luci-theme-nuxlab/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=xlucky0/luci-theme-nuxlab&v=2" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## Development

See the [development guide](docs/DEVELOPMENT.md) for source builds, LESS, templates, icons and checks.

[Releases](https://github.com/xlucky0/luci-theme-nuxlab/releases) · [Version history](RELEASE.md) · [Contributors](https://github.com/xlucky0/luci-theme-nuxlab/graphs/contributors) · [Report an issue](https://github.com/xlucky0/luci-theme-nuxlab/issues)

Licensed under [Apache-2.0](LICENSE). Thanks to [luci-theme-material](https://github.com/LuttyYang/luci-theme-material/).
