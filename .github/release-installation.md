## Package format / 安装包格式

This release publishes APK v3 packages only. Install them only on firmware using APK v3 (`apk-tools 3.x`); OPKG/IPK firmware is not supported.

本次发行仅提供 APK v3 安装包。仅适用于使用 APK v3（`apk-tools 3.x`）的固件，不支持 OPKG/IPK 固件。

## Install signed packages

Compare the SHA256 fingerprint in the release notes, then install the public key on the router:

```sh
wget -qO /tmp/install-key.sh https://github.com/xlucky0/NuxLab-Theme/releases/latest/download/install-key.sh &&
  sh /tmp/install-key.sh <SHA256-from-this-release>
apk add ./luci-theme-nuxlab-*.apk
```

For feed installation, add `https://xlucky0.github.io/NuxLab-Theme/feed` to `/etc/apk/repositories.d/customfeeds.list`, then run `apk update && apk add luci-theme-nuxlab`. Do not use `--allow-untrusted`. If the signing private key is lost or exposed, it must be rotated and routers must install the replacement public key.

## 已签名安装包

请先核对发行说明中的 SHA256 指纹，再在路由器上安装公钥：

```sh
wget -qO /tmp/install-key.sh https://github.com/xlucky0/NuxLab-Theme/releases/latest/download/install-key.sh &&
  sh /tmp/install-key.sh <本次发行的SHA256>
apk add ./luci-theme-nuxlab-*.apk
```

通过软件源安装时，将 `https://xlucky0.github.io/NuxLab-Theme/feed` 添加到 `/etc/apk/repositories.d/customfeeds.list`，然后执行 `apk update && apk add luci-theme-nuxlab`。不要使用 `--allow-untrusted`。如果签名私钥丢失或泄露，必须轮换密钥并让路由器安装新公钥。

## 修复与改进

- 修复提示条遮挡下拉菜单、表格下拉选项显示不完整的问题（#740、#741）。
- 适配新版 LuCI 仪表盘，修复布局及组件配置交互（#742）。
- 改善 Firefox ESR 的主题切换、组合控件、下拉菜单及端口统计显示（#739）。
- 增加视频背景播放/暂停与键盘跳转导航，优化实时图表更新性能。

## Fixes and improvements

- Fix inline alerts obscuring dropdowns and clipped dropdown options in tables (#740, #741).
- Support newer LuCI dashboard layouts and configurable widget interactions (#742).
- Improve Firefox ESR appearance controls, joined inputs, dropdowns and port statistics (#739).
- Add background video playback controls and a keyboard skip link, and reduce realtime chart layout work.

v3.1.0 及以上可在线升级。安装说明：[中文](https://github.com/xlucky0/NuxLab-Theme/blob/main/README_ZH.md#安装) · [English](https://github.com/xlucky0/NuxLab-Theme/blob/main/README.md#install)
