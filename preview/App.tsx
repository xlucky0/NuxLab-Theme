import React, {useEffect, useState} from 'react';
import {AnimatePresence, MotionConfig, motion} from 'motion/react';
import {
  Activity,
  ChevronDown,
  Cpu,
  Globe,
  Layers,
  LogOut,
  Menu,
  Moon,
  Network,
  Palette,
  Server,
  Shield,
  Sun,
  User,
  X,
} from 'lucide-react';
import {ConfigPreview} from './components/ConfigPreview.tsx';
import {LoginPreview} from './components/LoginPreview.tsx';
import {LuciComponentsPreview} from './components/LuciComponentsPreview.tsx';
import {NetworkPipeline} from './components/NetworkPipeline.tsx';
import {RelocationStats} from './components/RelocationStats.tsx';
import {SystemTelemetry} from './components/SystemTelemetry.tsx';
import {TrafficChart} from './components/TrafficChart.tsx';
import {WorldNodeMap} from './components/WorldNodeMap.tsx';
import {
  COPY,
  LangCode,
  NEON_PRESETS,
  NuxLabSettings,
  PreviewPage,
} from './types.ts';

export function App() {
  const [settings, setSettings] = useState<NuxLabSettings>({
    mode: 'light',
    lightPrimary: '#4f46e5',
    darkNeon: '#00e5ff',
    darkSecondary: '#d946ef',
    loginStyle: 'classic',
    blur: 12,
    opacity: 0.65,
    wallpaperSource: 'none',
  });
  const [page, setPage] = useState<PreviewPage>('dashboard');
  const [lang, setLang] = useState<LangCode>('id');
  const [openMenu, setOpenMenu] = useState<string>('status');
  const [activeRoute, setActiveRoute] = useState<string>('status/overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDark = settings.mode === 'dark';
  const accent = isDark ? settings.darkNeon : settings.lightPrimary;
  const t = COPY[lang];

  useEffect(() => {
    document.documentElement.dataset.nuxlabMode = settings.mode;
  }, [settings.mode]);

  const updateSettings = (patch: Partial<NuxLabSettings>) => {
    setSettings((prev) => ({...prev, ...patch}));
  };

  const navigateTo = (targetPage: PreviewPage, routeId: string, parentId?: string) => {
    setPage(targetPage);
    setActiveRoute(routeId);
    if (parentId) {
      setOpenMenu(parentId);
    }
    setMobileMenuOpen(false);
  };

  const handleTopViewSwitch = (targetPage: PreviewPage) => {
    const defaultRoutes: Record<PreviewPage, {route: string; parent: string}> = {
      dashboard: {route: 'status/overview', parent: 'status'},
      config: {route: 'system/nuxlab', parent: 'system'},
      luci: {route: 'network/interfaces', parent: 'network'},
      login: {route: 'logout', parent: ''},
    };
    const next = defaultRoutes[targetPage];
    navigateTo(targetPage, next.route, next.parent || undefined);
  };

  const openWrtMenus: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    iconAccent?: string;
    target?: PreviewPage;
    children?: Array<{id: string; label: string; target: PreviewPage; badge?: string}>;
  }> = [
    {
      id: 'status',
      label: t.menuStatus,
      icon: <Activity className="h-4 w-4" />,
      iconAccent: isDark ? accent : '#ffffff',
      children: [
        {id: 'status/overview', label: t.menuOverview, target: 'dashboard'},
        {id: 'status/routes', label: t.menuRoutes, target: 'dashboard'},
        {id: 'status/syslog', label: t.menuSysLog, target: 'luci'},
        {id: 'status/realtime', label: t.menuRealtime, target: 'dashboard'},
      ],
    },
    {
      id: 'system',
      label: t.menuSystem,
      icon: <Cpu className="h-4 w-4" />,
      iconAccent: '#fb923c',
      children: [
        {id: 'system/system', label: t.menuSystemProps, target: 'luci'},
        {id: 'system/admin', label: t.menuAdmin, target: 'luci'},
        {id: 'system/nuxlab', label: t.nuxlabConfig, target: 'config', badge: 'Theme'},
        {id: 'system/opkg', label: t.menuSoftware, target: 'luci'},
        {id: 'system/startup', label: t.menuStartup, target: 'luci'},
        {id: 'system/flash', label: t.menuFlash, target: 'luci'},
        {id: 'system/reboot', label: t.menuReboot, target: 'luci'},
      ],
    },
    {
      id: 'services',
      label: t.menuServices,
      icon: <Server className="h-4 w-4" />,
      iconAccent: '#22d3ee',
      children: [
        {id: 'services/adblock', label: t.menuAdblock, target: 'dashboard'},
        {id: 'services/ttyd', label: t.menuTerminal, target: 'luci'},
      ],
    },
    {
      id: 'network',
      label: t.menuNetwork,
      icon: <Network className="h-4 w-4" />,
      iconAccent: '#a78bfa',
      children: [
        {id: 'network/interfaces', label: t.menuInterfaces, target: 'luci'},
        {id: 'network/wireless', label: t.menuWireless, target: 'luci'},
        {id: 'network/dhcp', label: t.menuDhcpDns, target: 'luci'},
        {id: 'network/diagnostics', label: t.menuDiagnostics, target: 'luci'},
        {id: 'network/firewall', label: t.menuFirewall, target: 'luci'},
      ],
    },
    {
      id: 'vpn',
      label: t.menuVpn,
      icon: <Shield className="h-4 w-4" />,
      iconAccent: '#a78bfa',
      children: [
        {id: 'vpn/wireguard', label: t.menuWireguard, target: 'dashboard'},
        {id: 'vpn/openvpn', label: t.menuOpenvpn, target: 'dashboard'},
      ],
    },
    {
      id: 'logout',
      label: t.menuLogout,
      icon: <LogOut className="h-4 w-4" />,
      iconAccent: '#94a3b8',
      target: 'login',
    },
  ];

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col justify-between p-3.5">
      <div>
        {/* Brand */}
        <div className="mb-5 flex items-center justify-between px-2 pt-1">
          <button
            type="button"
            onClick={() => navigateTo('dashboard', 'status/overview', 'status')}
            className="flex items-center gap-2.5 cursor-pointer text-left"
          >
            <img
              src="/htdocs/luci-static/nuxlab/img/nuxlab.svg"
              alt="NuxLab"
              className="h-9 w-9 rounded-xl shrink-0"
              style={{
                boxShadow: isDark ? `0 0 18px -4px ${accent}99` : '0 6px 14px -4px rgba(15, 23, 42, 0.35)',
              }}
            />
            <div>
              <div className="font-display text-lg font-extrabold tracking-tight text-white leading-none">
                OpenWrt
              </div>
              <div
                className="mt-0.5 font-mono-num text-[10px] font-medium"
                style={{color: isDark ? accent : '#c7d2fe'}}
              >
                NuxLab · LuCI 25.12
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="rounded-lg p-1 text-white/80 hover:text-white lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* OpenWrt LuCI Accordion Nav List */}
        <nav className="space-y-1" aria-label="OpenWrt LuCI Menu">
          {openWrtMenus.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isExpanded = hasChildren && openMenu === item.id;
            const hasActiveChild = item.children?.some((sub) => sub.id === activeRoute);
            const isActiveTop =
              (item.id === 'logout' && page === 'login') ||
              Boolean(hasActiveChild && !isExpanded);

            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (hasChildren) {
                      setOpenMenu((prev) => (prev === item.id ? '' : item.id));
                    } else if (item.target) {
                      navigateTo(item.target, item.id);
                    }
                  }}
                  className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 cursor-pointer"
                  style={{
                    backgroundColor: isActiveTop
                      ? isDark
                        ? `${accent}1e`
                        : '#ffffff'
                      : isExpanded || hasActiveChild
                        ? isDark
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(255, 255, 255, 0.16)'
                        : 'transparent',
                    color: isActiveTop
                      ? isDark
                        ? accent
                        : settings.lightPrimary
                      : isDark
                        ? '#e2e8f0'
                        : 'rgba(255, 255, 255, 0.94)',
                    border: isActiveTop
                      ? isDark
                        ? `1px solid ${accent}66`
                        : '1px solid rgba(255,255,255,0.9)'
                      : '1px solid transparent',
                    boxShadow: isActiveTop
                      ? isDark
                        ? `0 0 18px -6px ${accent}66`
                        : '0 8px 20px -6px rgba(15, 23, 42, 0.22)'
                      : 'none',
                  }}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="shrink-0"
                      style={{
                        color: isActiveTop
                          ? isDark
                            ? accent
                            : settings.lightPrimary
                          : isDark
                            ? item.iconAccent
                            : '#ffffff',
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </span>
                  {hasChildren && (
                    <ChevronDown
                      className={`h-3.5 w-3.5 shrink-0 opacity-80 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div
                    className="mt-1 space-y-0.5 rounded-xl p-1.5 pl-3"
                    style={{
                      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.14)',
                    }}
                  >
                    {item.children!.map((sub) => {
                      const subActive = activeRoute === sub.id;
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => navigateTo(sub.target, sub.id, item.id)}
                          className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-xs font-medium transition-colors cursor-pointer"
                          style={{
                            backgroundColor: subActive
                              ? isDark
                                ? `${accent}24`
                                : '#ffffff'
                              : 'transparent',
                            color: subActive
                              ? isDark
                                ? accent
                                : settings.lightPrimary
                              : isDark
                                ? '#94a3b8'
                                : 'rgba(255, 255, 255, 0.90)',
                            fontWeight: subActive ? 600 : 500,
                          }}
                        >
                          <span className="truncate">{sub.label}</span>
                          {sub.badge && (
                            <span
                              className="rounded px-1.5 py-0.5 font-mono-num text-[9px] font-semibold uppercase tracking-wide shrink-0"
                              style={{
                                backgroundColor: subActive
                                  ? isDark
                                    ? `${accent}30`
                                    : `${settings.lightPrimary}18`
                                  : isDark
                                    ? 'rgba(0, 229, 255, 0.14)'
                                    : 'rgba(255, 255, 255, 0.22)',
                                color: subActive
                                  ? isDark
                                    ? accent
                                    : settings.lightPrimary
                                  : isDark
                                    ? accent
                                    : '#ffffff',
                              }}
                            >
                              {sub.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile + Language */}
      <div className="mt-4 flex items-center gap-2 pt-3 border-t" style={{borderColor: isDark ? '#182242' : 'rgba(255,255,255,0.2)'}}>
        <button
          type="button"
          onClick={() => navigateTo('login', 'logout')}
          title="Login screen preview"
          className="grid h-9 w-11 shrink-0 place-items-center rounded-xl border cursor-pointer transition-colors"
          style={{
            backgroundColor: isDark ? '#0c1226' : 'rgba(255, 255, 255, 0.14)',
            borderColor: isDark ? `${accent}44` : 'rgba(255, 255, 255, 0.35)',
            color: '#ffffff',
          }}
        >
          <User className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => setLang((prev) => (prev === 'id' ? 'en' : 'id'))}
          className="flex flex-1 items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium text-white cursor-pointer"
          style={{
            backgroundColor: isDark ? '#0c1226' : 'rgba(255, 255, 255, 0.14)',
            borderColor: isDark ? `${accent}44` : 'rgba(255, 255, 255, 0.35)',
          }}
        >
          <span className="flex items-center gap-1.5 truncate">
            <Globe className="h-3.5 w-3.5 shrink-0" />
            {lang === 'id' ? 'Bahasa Indonesia' : 'English'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-80" />
        </button>
      </div>
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="min-h-screen w-full transition-colors duration-200"
        style={{
          backgroundColor: isDark ? '#060812' : '#eef1fb',
          color: isDark ? '#f1f5f9' : '#1e293b',
          backgroundImage: isDark
            ? `radial-gradient(circle at 18% 12%, ${accent}14 0%, transparent 38%), radial-gradient(circle at 86% 84%, ${settings.darkSecondary}14 0%, transparent 40%)`
            : 'radial-gradient(circle at 85% 15%, rgba(99, 102, 241, 0.10) 0%, transparent 42%)',
        }}
      >
        {/* Preview Top Control Bar */}
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-md"
          style={{
            backgroundColor: isDark ? 'rgba(7, 10, 22, 0.88)' : 'rgba(255, 255, 255, 0.86)',
            borderColor: isDark ? `${accent}30` : 'rgba(79, 70, 229, 0.14)',
          }}
        >
          <div className="mx-auto flex max-w-[1640px] flex-wrap items-center justify-between gap-2.5 px-3 py-2 sm:px-5">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border lg:hidden cursor-pointer"
                style={{
                  borderColor: isDark ? '#273452' : '#dce2f5',
                  color: isDark ? accent : '#4f46e5',
                }}
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <span
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono-num text-xs font-semibold whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: isDark ? `${accent}1a` : '#eef2ff',
                  color: accent,
                  border: `1px solid ${isDark ? `${accent}44` : 'rgba(79, 70, 229, 0.2)'}`,
                }}
              >
                <Activity className="h-3.5 w-3.5" />
                NuxLab Live Preview
              </span>
              <span className="hidden xl:inline text-xs" style={{color: isDark ? '#94a3b8' : '#64748b'}}>
                luci-theme-nuxlab &amp; luci-app-nuxlab
              </span>
            </div>

            {/* View Switcher */}
            <div
              className="flex items-center gap-1 rounded-xl p-1 overflow-x-auto max-w-full"
              style={{
                backgroundColor: isDark ? '#0c1226' : '#eef2ff',
                border: `1px solid ${isDark ? '#1d2949' : '#dce2f5'}`,
              }}
            >
              {(
                [
                  ['dashboard', t.dashboard],
                  ['login', t.loginPreview],
                  ['config', t.nuxlabConfig],
                  ['luci', t.luciComponents],
                ] as const
              ).map(([id, label]) => {
                const active = page === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handleTopViewSwitch(id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0"
                    style={{
                      backgroundColor: active ? accent : 'transparent',
                      color: active ? (isDark ? '#040814' : '#ffffff') : isDark ? '#cbd5e1' : '#475569',
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Theme Mode & Neon Accent Switchers */}
            <div className="flex items-center gap-2">
              <div
                className="hidden sm:flex items-center gap-1.5 rounded-xl border px-2 py-1"
                style={{
                  backgroundColor: isDark ? '#0c1226' : '#f8faff',
                  borderColor: isDark ? '#1d2949' : '#dce2f5',
                }}
                title="Cyberpunk Neon Accent Presets"
              >
                <Palette className="h-3.5 w-3.5 opacity-70" />
                {NEON_PRESETS.map((preset) => {
                  const swatchColor = isDark ? preset.darkPrimary : preset.lightPrimary;
                  const active = isDark
                    ? settings.darkNeon === preset.darkPrimary
                    : settings.lightPrimary === preset.lightPrimary;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        updateSettings({
                          darkNeon: preset.darkPrimary,
                          darkSecondary: preset.darkSecondary,
                          lightPrimary: preset.lightPrimary,
                        })
                      }
                      aria-label={preset.label}
                      title={preset.label}
                      className="h-4 w-4 rounded-full cursor-pointer transition-transform hover:scale-110"
                      style={{
                        backgroundColor: swatchColor,
                        outline: active ? `2px solid ${isDark ? '#ffffff' : '#1e293b'}` : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => updateSettings({mode: isDark ? 'light' : 'dark'})}
                className="inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-all whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: isDark ? `${accent}18` : '#ffffff',
                  borderColor: isDark ? `${accent}55` : '#c7d2fe',
                  color: isDark ? accent : '#4f46e5',
                  boxShadow: isDark ? `0 0 16px -6px ${accent}88` : '0 2px 8px rgba(79, 70, 229, 0.12)',
                }}
              >
                {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                <span>{isDark ? 'Cyberpunk Neon' : 'Frost Indigo'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Shell: Sidebar + Content */}
        <div className="mx-auto flex max-w-[1640px] gap-4 p-3 sm:p-5">
          {/* Desktop Sidebar */}
          <aside
            className="hidden lg:block w-[240px] shrink-0 self-start sticky top-[68px] rounded-2xl border overflow-hidden transition-colors duration-200"
            style={{
              minHeight: 'calc(100vh - 96px)',
              background: isDark
                ? 'linear-gradient(180deg, #090e1f 0%, #070b18 100%)'
                : `linear-gradient(180deg, ${settings.lightPrimary} 0%, #6366f1 100%)`,
              borderColor: isDark ? `${accent}36` : 'rgba(79, 70, 229, 0.25)',
              boxShadow: isDark
                ? `0 0 0 1px ${accent}1a, 0 20px 44px -12px rgba(0, 0, 0, 0.8)`
                : '0 18px 40px -14px rgba(67, 56, 202, 0.45)',
            }}
          >
            {renderSidebarContent()}
          </aside>

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-black/60"
                onClick={() => setMobileMenuOpen(false)}
              />
              <aside
                className="relative z-10 h-full w-[250px] overflow-y-auto"
                style={{
                  background: isDark
                    ? 'linear-gradient(180deg, #090e1f 0%, #070b18 100%)'
                    : `linear-gradient(180deg, ${settings.lightPrimary} 0%, #6366f1 100%)`,
                }}
              >
                {renderSidebarContent()}
              </aside>
            </div>
          )}

          {/* Main Workspace */}
          <main className="min-w-0 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{opacity: 0, y: 6}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -4}}
                transition={{duration: 0.16, ease: [0.16, 1, 0.3, 1]}}
              >
                {page === 'dashboard' && (
                  <div className="space-y-4">
                    {/* Top Row: World Node Map (8 cols) + Network Pipeline (4 cols) */}
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                      <div className="xl:col-span-7">
                        <WorldNodeMap
                          mode={settings.mode}
                          lang={lang}
                          accent={accent}
                          secondaryAccent={settings.darkSecondary}
                        />
                      </div>
                      <div className="xl:col-span-5">
                        <NetworkPipeline
                          mode={settings.mode}
                          lang={lang}
                          accent={accent}
                          secondaryAccent={settings.darkSecondary}
                        />
                      </div>
                    </div>

                    {/* Lower Bento Grid: Left Telemetry + Chart | Right System & Logs */}
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                      <div className="space-y-4 xl:col-span-7">
                        <RelocationStats
                          mode={settings.mode}
                          lang={lang}
                          accent={accent}
                          secondaryAccent={settings.darkSecondary}
                        />
                        <TrafficChart
                          mode={settings.mode}
                          lang={lang}
                          accent={accent}
                          secondaryAccent={settings.darkSecondary}
                        />
                      </div>
                      <div className="xl:col-span-5">
                        <SystemTelemetry
                          mode={settings.mode}
                          lang={lang}
                          accent={accent}
                          secondaryAccent={settings.darkSecondary}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {page === 'login' && (
                  <LoginPreview
                    settings={settings}
                    onUpdate={updateSettings}
                    onEnterDashboard={() => setPage('dashboard')}
                  />
                )}

                {page === 'config' && (
                  <ConfigPreview settings={settings} onUpdate={updateSettings} />
                )}

                {page === 'luci' && <LuciComponentsPreview settings={settings} />}
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <footer
              className="mt-6 flex flex-wrap items-center justify-between gap-2 px-1 text-[11px]"
              style={{color: isDark ? '#64748b' : '#64748b'}}
            >
              <span>
                OpenWrt LuCI Theme · <strong style={{color: accent}}>NuxLab v1.0.0</strong> (luci-theme-nuxlab &amp; luci-app-nuxlab)
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono-num">
                <Layers className="h-3 w-3" />
                xlucky0/NuxLab-Theme · Apache-2.0
              </span>
            </footer>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
