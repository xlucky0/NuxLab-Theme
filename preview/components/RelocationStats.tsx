import React from 'react';
import {ArrowUpDown, Database, Filter, Shield} from 'lucide-react';
import {COPY, LangCode, ThemeMode} from '../types.ts';

interface Props {
  mode: ThemeMode;
  lang: LangCode;
  accent: string;
  secondaryAccent: string;
}

export const RelocationStats: React.FC<Props> = ({mode, lang, accent, secondaryAccent}) => {
  const t = COPY[lang];
  const isDark = mode === 'dark';

  return (
    <section
      className="relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-colors duration-200"
      style={{
        backgroundColor: isDark ? '#0b1022' : 'rgba(255, 255, 255, 0.92)',
        borderColor: isDark ? `${accent}36` : 'rgba(79, 70, 229, 0.14)',
        boxShadow: isDark
          ? `0 0 0 1px ${accent}1a, 0 16px 36px -12px rgba(0, 0, 0, 0.72)`
          : '0 10px 30px -10px rgba(49, 46, 129, 0.10)',
      }}
    >
      {/* Top 3 KPI counters */}
      <div className="grid grid-cols-1 gap-4 border-b pb-4 sm:grid-cols-3" style={{borderColor: isDark ? '#182242' : '#e8ecfb'}}>
        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium" style={{color: isDark ? '#94a3b8' : '#475569'}}>
            <Shield className="h-3.5 w-3.5" style={{color: accent}} />
            <span>{t.relocations}</span>
          </div>
          <div className="font-mono-num text-2xl font-bold tracking-tight" style={{color: isDark ? accent : '#4f46e5'}}>
            5,023
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium" style={{color: isDark ? '#94a3b8' : '#475569'}}>
            <ArrowUpDown className="h-3.5 w-3.5" style={{color: isDark ? secondaryAccent : '#6366f1'}} />
            <span>{t.relocTraffic}</span>
          </div>
          <div className="font-mono-num text-2xl font-bold tracking-tight" style={{color: isDark ? '#f1f5f9' : '#4f46e5'}}>
            362.77 <span className="text-xs font-semibold opacity-75">MB</span>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-center gap-1.5 text-xs font-medium" style={{color: isDark ? '#94a3b8' : '#475569'}}>
            <Database className="h-3.5 w-3.5" style={{color: isDark ? '#10f5a8' : '#10b981'}} />
            <span>{t.dataSaved}</span>
          </div>
          <div className="font-mono-num text-2xl font-bold tracking-tight" style={{color: isDark ? '#10f5a8' : '#4f46e5'}}>
            128.4 <span className="text-xs font-semibold opacity-75">MB</span>
          </div>
        </div>
      </div>

      {/* Bottom DNS & HTTPS filters */}
      <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-2.5 flex items-center gap-2 text-xs">
            <Filter className="h-3.5 w-3.5" style={{color: accent}} />
            <span className="font-semibold" style={{color: isDark ? '#e2e8f0' : '#1e293b'}}>
              {t.dnsFilter}
            </span>
            <span
              className="rounded-md px-2 py-0.5 font-mono-num text-[11px] font-semibold"
              style={{
                backgroundColor: isDark ? `${accent}18` : '#eef2ff',
                color: isDark ? accent : '#4338ca',
              }}
            >
              Total: 1,482
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              {label: t.adsBlocked, value: '1,120', color: isDark ? accent : '#4f46e5'},
              {label: t.trackersBlocked, value: '318', color: isDark ? secondaryAccent : '#4f46e5'},
              {label: t.malwareBlocked, value: '44', color: isDark ? '#ff5c8a' : '#4f46e5'},
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-2"
                style={{backgroundColor: isDark ? '#070b18' : '#f7f9ff'}}
              >
                <div className="font-mono-num text-lg font-bold" style={{color: item.color}}>
                  {item.value}
                </div>
                <div className="truncate text-[10px]" style={{color: isDark ? '#94a3b8' : '#64748b'}}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2.5 flex items-center gap-2 text-xs">
            <Shield className="h-3.5 w-3.5" style={{color: isDark ? secondaryAccent : '#4f46e5'}} />
            <span className="font-semibold" style={{color: isDark ? '#e2e8f0' : '#1e293b'}}>
              {t.httpsFilter}
            </span>
            <span
              className="rounded-md px-2 py-0.5 font-mono-num text-[11px] font-semibold"
              style={{
                backgroundColor: isDark ? `${secondaryAccent}18` : '#eef2ff',
                color: isDark ? secondaryAccent : '#4338ca',
              }}
            >
              Total: 289
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              {label: t.adsBlocked, value: '214', color: isDark ? accent : '#4f46e5'},
              {label: t.trackersBlocked, value: '63', color: isDark ? secondaryAccent : '#4f46e5'},
              {label: t.malwareBlocked, value: '12', color: isDark ? '#10f5a8' : '#4f46e5'},
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl p-2"
                style={{backgroundColor: isDark ? '#070b18' : '#f7f9ff'}}
              >
                <div className="font-mono-num text-lg font-bold" style={{color: item.color}}>
                  {item.value}
                </div>
                <div className="truncate text-[10px]" style={{color: isDark ? '#94a3b8' : '#64748b'}}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
