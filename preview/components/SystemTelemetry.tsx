import React, {useState} from 'react';
import {
  ChevronDown,
  Cpu,
  FileText,
  Grid,
  Info,
  ShieldAlert,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {COPY, LangCode, ThemeMode} from '../types.ts';

interface Props {
  mode: ThemeMode;
  lang: LangCode;
  accent: string;
  secondaryAccent: string;
}

const APP_ROUTES = [
  {app: 'Cloudflare Warp', region: 'Singapore - Edge 01', latency: '11 ms', code: 'CF'},
  {app: 'GitHub Enterprise', region: 'Tokyo - JP 02', latency: '44 ms', code: 'GH'},
  {app: 'YouTube 4K Stream', region: 'Singapore - SG 03', latency: '16 ms', code: 'YT'},
  {app: 'OpenAI API', region: 'San Jose - US 01', latency: '134 ms', code: 'AI'},
];

const ROUTE_LOGS = [
  'IP 172.66.159.80 (edge.nuxlab.net), rgn SG-01, routed in 11ms',
  'IP 140.82.121.4 (github.com), rgn TYO-02, routed in 44ms',
  'IP 104.18.32.7 (api.cloudflare.com), rgn SG-03, routed in 13ms',
  'IP 172.64.80.1 (dns.nuxlab.io), rgn ID-JKT, direct local',
  'IP 208.95.112.1 (telemetry.node), rgn US-W1, encrypted tunnel',
];

const BLOCKER_LOGS = [
  'BLOCKED [ADS] doubleclick.net -> 0.0.0.0 (Rule #412)',
  'BLOCKED [TRACKER] pixel.analytics.io -> NXDOMAIN',
  'BLOCKED [MALWARE] suspicious-drop.cc -> Sinkholed',
  'BLOCKED [ADS] adservice.example -> 0.0.0.0 (DNS Filter)',
  'BLOCKED [TRACKER] telemetry-sdk.app -> NXDOMAIN',
];

export const SystemTelemetry: React.FC<Props> = ({mode, lang, accent, secondaryAccent}) => {
  const t = COPY[lang];
  const isDark = mode === 'dark';
  const [wifiOn, setWifiOn] = useState(false);
  const [logCategory, setLogCategory] = useState<'route' | 'blocker'>('route');
  const [logSubTab, setLogSubTab] = useState<'domain' | 'app'>('domain');
  const [selectedApp, setSelectedApp] = useState(0);

  const cardStyle: React.CSSProperties = {
    backgroundColor: isDark ? '#0b1022' : 'rgba(255, 255, 255, 0.92)',
    borderColor: isDark ? `${accent}36` : 'rgba(79, 70, 229, 0.14)',
    boxShadow: isDark
      ? `0 0 0 1px ${accent}1a, 0 16px 36px -12px rgba(0, 0, 0, 0.72)`
      : '0 10px 30px -10px rgba(49, 46, 129, 0.10)',
  };

  // Dual-arc circular SVG gauge math
  const cpuPct = 4;
  const memPct = 44;
  const outerR = 54;
  const innerR = 42;
  const outerC = 2 * Math.PI * outerR;
  const innerC = 2 * Math.PI * innerR;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* Wi-Fi Settings */}
      <section className="rounded-2xl border p-4 transition-colors" style={cardStyle}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {wifiOn ? (
              <Wifi className="h-4 w-4" style={{color: isDark ? '#10f5a8' : '#4f46e5'}} />
            ) : (
              <WifiOff className="h-4 w-4" style={{color: isDark ? '#64748b' : '#94a3b8'}} />
            )}
            <h3 className="text-sm font-semibold" style={{color: isDark ? '#f1f5f9' : '#1e293b'}}>
              {t.wifiSettings}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setWifiOn((v) => !v)}
            className="rounded-md px-2 py-0.5 text-[11px] font-semibold cursor-pointer transition-colors"
            style={{
              backgroundColor: wifiOn
                ? isDark
                  ? 'rgba(16, 245, 168, 0.16)'
                  : 'rgba(16, 185, 129, 0.14)'
                : isDark
                  ? '#141d38'
                  : '#eef2ff',
              color: wifiOn ? (isDark ? '#10f5a8' : '#059669') : isDark ? '#94a3b8' : '#4f46e5',
              border: `1px solid ${wifiOn ? (isDark ? 'rgba(16, 245, 168, 0.35)' : 'rgba(16, 185, 129, 0.3)') : isDark ? '#273452' : '#dce2f5'}`,
            }}
          >
            {wifiOn ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="flex min-h-[112px] flex-col items-center justify-center text-center">
          {wifiOn ? (
            <div className="space-y-1.5">
              <div className="text-sm font-semibold font-mono-num" style={{color: accent}}>
                NuxLab-Mesh-5G
              </div>
              <div className="text-xs" style={{color: isDark ? '#94a3b8' : '#64748b'}}>
                {t.wifiActive} · Ch 149 (80MHz)
              </div>
              <div className="text-[11px] font-mono-num" style={{color: isDark ? '#10f5a8' : '#059669'}}>
                WPA3-SAE · 6 Clients
              </div>
            </div>
          ) : (
            <p className="text-xs" style={{color: isDark ? '#64748b' : '#94a3b8'}}>
              {t.wifiDisabled}
            </p>
          )}
        </div>
      </section>

      {/* Device Dual-Arc Gauge */}
      <section className="rounded-2xl border p-4 transition-colors" style={cardStyle}>
        <div className="mb-2 flex items-center gap-2">
          <Cpu className="h-4 w-4" style={{color: accent}} />
          <h3 className="text-sm font-semibold" style={{color: isDark ? '#f1f5f9' : '#1e293b'}}>
            {t.deviceInfo}
          </h3>
        </div>

        <div className="flex items-center justify-center py-1">
          <div className="relative h-32 w-32">
            <svg viewBox="0 0 132 132" className="h-full w-full -rotate-90">
              {/* Background tracks */}
              <circle
                cx="66"
                cy="66"
                r={outerR}
                fill="none"
                stroke={isDark ? '#141d38' : '#e8ecfb'}
                strokeWidth="7"
              />
              <circle
                cx="66"
                cy="66"
                r={innerR}
                fill="none"
                stroke={isDark ? '#141d38' : '#eef2ff'}
                strokeWidth="7"
              />
              {/* Memory arc (outer) */}
              <circle
                cx="66"
                cy="66"
                r={outerR}
                fill="none"
                stroke={isDark ? accent : '#38bdf8'}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={outerC}
                strokeDashoffset={outerC * (1 - memPct / 100)}
              />
              {/* CPU arc (inner) */}
              <circle
                cx="66"
                cy="66"
                r={innerR}
                fill="none"
                stroke={isDark ? secondaryAccent : '#4f46e5'}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={innerC}
                strokeDashoffset={innerC * (1 - cpuPct / 100)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center leading-tight">
              <div className="font-mono-num text-sm font-bold" style={{color: isDark ? secondaryAccent : '#4f46e5'}}>
                {cpuPct}% <span className="text-[10px] font-normal opacity-75">CPU</span>
              </div>
              <div className="font-mono-num text-sm font-bold" style={{color: isDark ? accent : '#0284c7'}}>
                {memPct}% <span className="text-[10px] font-normal opacity-75">{t.memory}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Relocation */}
      <section className="rounded-2xl border p-4 transition-colors" style={cardStyle}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Grid className="h-4 w-4" style={{color: accent}} />
            <h3 className="text-sm font-semibold" style={{color: isDark ? '#f1f5f9' : '#1e293b'}}>
              {t.appRelocation}
            </h3>
          </div>
          <span className="text-[11px] font-mono-num" style={{color: isDark ? '#94a3b8' : '#64748b'}}>
            4 Rules
          </span>
        </div>

        <div className="space-y-2">
          {APP_ROUTES.map((item, idx) => {
            const active = selectedApp === idx;
            return (
              <button
                key={item.app}
                type="button"
                onClick={() => setSelectedApp(idx)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2 text-left cursor-pointer transition-colors"
                style={{
                  backgroundColor: active
                    ? isDark
                      ? '#131d3b'
                      : '#f1f5ff'
                    : isDark
                      ? '#080c1c'
                      : '#f8faff',
                  borderColor: active
                    ? isDark
                      ? `${accent}55`
                      : 'rgba(79, 70, 229, 0.28)'
                    : isDark
                      ? '#192446'
                      : '#e2e8f6',
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[10px] font-bold font-mono-num"
                    style={{
                      backgroundColor: isDark ? `${accent}20` : '#4f46e5',
                      color: isDark ? accent : '#ffffff',
                    }}
                  >
                    {item.code}
                  </span>
                  <div className="min-w-0">
                    <div
                      className="truncate text-xs font-semibold"
                      style={{color: isDark ? '#f1f5f9' : '#1e293b'}}
                    >
                      {item.app}
                    </div>
                    <div className="truncate text-[11px]" style={{color: isDark ? '#94a3b8' : '#64748b'}}>
                      {item.region}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="font-mono-num text-[11px]" style={{color: isDark ? '#10f5a8' : '#059669'}}>
                    {item.latency}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" style={{color: isDark ? accent : '#4f46e5'}} />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Logs Panel */}
      <section className="rounded-2xl border p-4 transition-colors" style={cardStyle}>
        <div className="mb-3 flex items-center gap-3 border-b pb-2" style={{borderColor: isDark ? '#192446' : '#e5e9f7'}}>
          <button
            type="button"
            onClick={() => setLogCategory('route')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer pb-1 transition-colors whitespace-nowrap shrink-0"
            style={{
              color: logCategory === 'route' ? (isDark ? accent : '#4f46e5') : isDark ? '#94a3b8' : '#64748b',
              borderBottom: logCategory === 'route' ? `2px solid ${accent}` : '2px solid transparent',
            }}
          >
            <FileText className="h-3.5 w-3.5" />
            {t.smartRouteLog}
          </button>
          <button
            type="button"
            onClick={() => setLogCategory('blocker')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer pb-1 transition-colors whitespace-nowrap shrink-0"
            style={{
              color: logCategory === 'blocker' ? (isDark ? secondaryAccent : '#4f46e5') : isDark ? '#94a3b8' : '#64748b',
              borderBottom: logCategory === 'blocker' ? `2px solid ${secondaryAccent}` : '2px solid transparent',
            }}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            {t.blockerLog}
          </button>
        </div>

        {logCategory === 'route' && (
          <div className="mb-2.5 flex gap-1.5">
            {(['domain', 'app'] as const).map((tab) => {
              const active = logSubTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setLogSubTab(tab)}
                  className="rounded-full px-2.5 py-1 text-[11px] font-medium cursor-pointer transition-colors whitespace-nowrap shrink-0"
                  style={{
                    backgroundColor: active
                      ? isDark
                        ? accent
                        : '#4f46e5'
                      : isDark
                        ? '#101832'
                        : '#eef2ff',
                    color: active ? (isDark ? '#040814' : '#ffffff') : isDark ? '#94a3b8' : '#475569',
                  }}
                >
                  {tab === 'domain' ? t.domainIpTab : t.appTab}
                </button>
              );
            })}
          </div>
        )}

        <div className="space-y-1.5 max-h-[168px] overflow-y-auto pr-1">
          {(logCategory === 'route' ? ROUTE_LOGS : BLOCKER_LOGS).map((line, i) => (
            <div
              key={i}
              className="rounded-lg px-2.5 py-1.5 font-mono-num text-[11px] leading-snug"
              style={{
                backgroundColor: isDark ? '#070b18' : '#f1f5ff',
                border: `1px solid ${isDark ? '#182242' : '#e2e8f8'}`,
                color:
                  logCategory === 'blocker'
                    ? isDark
                      ? '#ff6b9d'
                      : '#be123c'
                    : isDark
                      ? '#cbd5e1'
                      : '#334155',
              }}
            >
              {logCategory === 'route' && logSubTab === 'app' ? `[APP] ${APP_ROUTES[i % APP_ROUTES.length].app} → ${line}` : line}
            </div>
          ))}
        </div>
      </section>

      {/* System Information (spans 2 cols on sm+) */}
      <section className="rounded-2xl border p-4 sm:col-span-2 transition-colors" style={cardStyle}>
        <div className="mb-3 flex items-center gap-2">
          <Info className="h-4 w-4" style={{color: accent}} />
          <h3 className="text-sm font-semibold" style={{color: isDark ? '#f1f5f9' : '#1e293b'}}>
            {t.systemInfo}
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2 text-xs">
          {[
            [t.uptime, '0d 4h 52m'],
            [t.totalDown, '383.0 MB'],
            [t.totalUp, '18.4 MB'],
            [t.swVersion, 'luci-theme-nuxlab v1.0.0'],
            [t.publicIp, '180.248.163.243'],
            ['Architecture', 'ARMv8 Cortex-A53 · OpenWrt 24.10'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-2 border-b py-1.5"
              style={{borderColor: isDark ? '#141d38' : '#eef2ff'}}
            >
              <span style={{color: isDark ? '#94a3b8' : '#64748b'}}>{label}</span>
              <span className="font-mono-num font-medium text-right" style={{color: isDark ? accent : '#4338ca'}}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
