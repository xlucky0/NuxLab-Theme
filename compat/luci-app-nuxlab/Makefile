include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-nuxlab
PKG_VERSION:=3.1.4
PKG_RELEASE:=20261113
PKG_LICENSE:=Apache-2.0

LUCI_TITLE:=NuxLab configuration compatibility package
LUCI_PKGARCH:=all

# Save even an unchanged legacy conffile before the empty package releases it.
# The integrated theme consumes this private backup on its first initialization.
define Package/luci-app-nuxlab/preinst
#!/bin/sh
root="$${IPKG_INSTROOT}"
if [ ! -f "$$root/usr/share/nuxlab/config-integrated" ] && \
   [ -f "$$root/etc/config/nuxlab" ]; then
	umask 077
	mkdir -p "$$root/etc/nuxlab-config-migration" || exit 1
	cp -p "$$root/etc/config/nuxlab" "$$root/etc/nuxlab-config-migration/nuxlab" || exit 1
fi
exit 0
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - make this nested recipe visible to OpenWrt package scans.
