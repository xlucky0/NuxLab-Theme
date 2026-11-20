import React, {useState} from 'react';
import {Check, Layers, Network, Terminal} from 'lucide-react';
import {NuxLabSettings} from '../types.ts';

interface Props {
  settings: NuxLabSettings;
}

export const LuciComponentsPreview: React.FC<Props> = ({settings}) => {
  const isDark = settings.mode === 'dark';
  const accent = isDark ? settings.darkNeon : settings.lightPrimary;
  const [activeTab, setActiveTab] = useState<'interfaces' | 'firewall' | 'leases'>('interfaces');

  const cardStyle: React.CSSProperties = {
    backgroundColor: isDark ? '#0b1022' : 'rgba(255, 255, 255, 0.92)',
    borderColor: isDark ? `${accent}36` : 'rgba(79, 70, 229, 0.14)',
    boxShadow: isDark
      ? `0 0 0 1px ${accent}1a, 0 16px 36px -12px rgba(0, 0, 0, 0.72)`
      : '0 10px 30px -10px rgba(49, 46, 129, 0.10)',
  };

  return (
    <div className="space-y-4">
      {/* Native cbi-tabmenu */}
      <div
        className="flex items-center gap-1 rounded-2xl border p-1.5 overflow-x-auto"
        style={cardStyle}
      >
        {(
          [
            ['interfaces', 'Network Interfaces'],
            ['firewall', 'Firewall Zones'],
            ['leases', 'DHCPv4 Leases'],
          ] as const
        ).map(([key, label]) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0"
              style={{
                backgroundColor: active ? (isDark ? `${accent}24` : '#eef2ff') : 'transparent',
                color: active ? accent : isDark ? '#94a3b8' : '#475569',
                borderBottom: active ? `2px solid ${accent}` : '2px solid transparent',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Interfaces Grid + Progressbars */}
      {activeTab === 'interfaces' && (
        <section className="rounded-2xl border p-5 space-y-4" style={cardStyle}>
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4" style={{color: accent}} />
            <h3 className="text-sm font-semibold" style={{color: isDark ? '#f1f5f9' : '#1e293b'}}>
              LuCI Native Port & Progress Components (cascade.css tokens)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {port: 'WAN', speed: '1000Mb/s FD', rx: '383.0 MB', tx: '18.4 MB', up: true},
              {port: 'LAN 1', speed: '1000Mb/s FD', rx: '1.24 GB', tx: '412 MB', up: true},
              {port: 'LAN 2', speed: '2500Mb/s FD', rx: '842 MB', tx: '190 MB', up: true},
              {port: 'LAN 3', speed: 'No Link', rx: '0 B', tx: '0 B', up: false},
            ].map((iface) => (
              <div
                key={iface.port}
                className="overflow-hidden rounded-xl border"
                style={{
                  backgroundColor: isDark ? '#080c1c' : '#f8faff',
                  borderColor: iface.up ? (isDark ? `${accent}44` : '#c7d2fe') : isDark ? '#1e2949' : '#e2e8f6',
                }}
              >
                <div
                  className="px-3 py-1.5 text-center text-xs font-bold font-mono-num"
                  style={{
                    backgroundColor: iface.up ? (isDark ? '#162246' : '#e0e7ff') : isDark ? '#101730' : '#e7ebf7',
                    color: isDark ? '#f1f5f9' : '#1e293b',
                  }}
                >
                  {iface.port}
                </div>
                <div className="p-3 text-center space-y-1.5">
                  <div
                    className="text-xs font-semibold font-mono-num"
                    style={{color: iface.up ? (isDark ? '#10f5a8' : '#059669') : isDark ? '#64748b' : '#94a3b8'}}
                  >
                    {iface.speed}
                  </div>
                  <div className="text-[11px] font-mono-num" style={{color: isDark ? '#94a3b8' : '#64748b'}}>
                    RX {iface.rx} · TX {iface.tx}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Native cbi-progressbar */}
          <div className="space-y-3 pt-2">
            {[
              {label: 'Overlay Flash Storage (/overlay)', pct: 34, val: '21.8 MB / 64.0 MB'},
              {label: 'Buffered RAM Usage', pct: 44, val: '450 MB / 1024 MB'},
            ].map((bar) => (
              <div key={bar.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span style={{color: isDark ? '#cbd5e1' : '#334155'}}>{bar.label}</span>
                  <span className="font-mono-num" style={{color: accent}}>
                    {bar.val} ({bar.pct}%)
                  </span>
                </div>
                <div
                  className="h-2.5 w-full overflow-hidden rounded-full"
                  style={{backgroundColor: isDark ? '#070b17' : '#e2e8f8'}}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${bar.pct}%`,
                      background: isDark
                        ? `linear-gradient(90deg, ${accent}, ${settings.darkSecondary})`
                        : accent,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Firewall Zones */}
      {activeTab === 'firewall' && (
        <section className="rounded-2xl border p-5 space-y-3" style={cardStyle}>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4" style={{color: accent}} />
            <h3 className="text-sm font-semibold" style={{color: isDark ? '#f1f5f9' : '#1e293b'}}>
              LuCI Firewall Zone Badges
            </h3>
          </div>
          <div className="space-y-2 text-xs">
            {[
              {zone: 'lan => wan', input: 'ACCEPT', output: 'ACCEPT', forward: 'ACCEPT', color: isDark ? '#10f5a8' : '#10b981'},
              {zone: 'wan => REJECT', input: 'REJECT', output: 'ACCEPT', forward: 'REJECT', color: isDark ? '#ff5c8a' : '#ef4444'},
            ].map((row) => (
              <div
                key={row.zone}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5"
                style={{
                  backgroundColor: isDark ? '#070b18' : '#f8faff',
                  borderColor: isDark ? '#192446' : '#e2e8f6',
                }}
              >
                <span
                  className="rounded-md px-2.5 py-1 font-mono-num font-bold"
                  style={{backgroundColor: `${row.color}22`, color: row.color, border: `1px solid ${row.color}55`}}
                >
                  {row.zone}
                </span>
                <div className="flex items-center gap-3 font-mono-num" style={{color: isDark ? '#cbd5e1' : '#334155'}}>
                  <span>IN: {row.input}</span>
                  <span>OUT: {row.output}</span>
                  <span>FWD: {row.forward}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DHCPv4 Leases Table */}
      {activeTab === 'leases' && (
        <section className="rounded-2xl border overflow-hidden" style={cardStyle}>
          <div className="flex items-center gap-2 px-5 py-3.5 border-b" style={{borderColor: isDark ? '#182242' : '#e8ecfb'}}>
            <Terminal className="h-4 w-4" style={{color: accent}} />
            <h3 className="text-sm font-semibold" style={{color: isDark ? '#f1f5f9' : '#1e293b'}}>
              Active DHCP Leases (tabular-nums)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr style={{backgroundColor: isDark ? '#0e1429' : '#f4f6ff', color: isDark ? '#94a3b8' : '#475569'}}>
                  <th className="px-4 py-2.5 font-semibold">Hostname</th>
                  <th className="px-4 py-2.5 font-semibold">IPv4 Address</th>
                  <th className="px-4 py-2.5 font-semibold">MAC Address</th>
                  <th className="px-4 py-2.5 font-semibold">Lease Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono-num" style={{borderColor: isDark ? '#182242' : '#eef2ff'}}>
                {[
                  ['nuxlab-workstation', '192.168.1.102', 'A4:83:E7:2F:11:9C', '11h 42m 10s'],
                  ['iphone-16-pro', '192.168.1.118', '7C:10:C9:8A:44:02', '08h 15m 49s'],
                  ['nas-truenas', '192.168.1.200', '00:1B:21:BB:71:4E', 'Static'],
                ].map(([host, ip, mac, lease]) => (
                  <tr key={mac} style={{color: isDark ? '#e2e8f0' : '#1e293b'}}>
                    <td className="px-4 py-2.5 font-sans font-medium">{host}</td>
                    <td className="px-4 py-2.5" style={{color: accent}}>
                      {ip}
                    </td>
                    <td className="px-4 py-2.5 opacity-80">{mac}</td>
                    <td className="px-4 py-2.5 inline-flex items-center gap-1" style={{color: isDark ? '#10f5a8' : '#059669'}}>
                      <Check className="h-3 w-3" />
                      {lease}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};
