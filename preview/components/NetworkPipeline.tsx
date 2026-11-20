import React, {useState} from 'react';
import {Check, Cpu, Laptop, Router, Server, Smartphone} from 'lucide-react';
import {COPY, LangCode, ThemeMode} from '../types.ts';

interface Props {
  mode: ThemeMode;
  lang: LangCode;
  accent: string;
  secondaryAccent: string;
}

const TOPOLOGY_MODES = ['VWire', 'Router', 'Bridge'] as const;

export const NetworkPipeline: React.FC<Props> = ({mode, lang, accent, secondaryAccent}) => {
  const t = COPY[lang];
  const isDark = mode === 'dark';
  const [topology, setTopology] = useState<(typeof TOPOLOGY_MODES)[number]>('VWire');

  return (
    <section
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl border p-4 sm:p-5 transition-colors duration-200"
      style={{
        backgroundColor: isDark ? '#0b1022' : 'rgba(255, 255, 255, 0.92)',
        borderColor: isDark ? `${accent}36` : 'rgba(79, 70, 229, 0.14)',
        boxShadow: isDark
          ? `0 0 0 1px ${accent}1a, 0 16px 36px -12px rgba(0, 0, 0, 0.72)`
          : '0 10px 30px -10px rgba(49, 46, 129, 0.10)',
      }}
    >
      {isDark && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${secondaryAccent}, ${accent}, transparent)`,
            opacity: 0.75,
          }}
        />
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Cpu className="h-4 w-4 shrink-0" style={{color: accent}} />
          <h2
            className="text-sm font-semibold tracking-tight truncate"
            style={{color: isDark ? '#f1f5f9' : '#1e293b'}}
          >
            {t.workMode.replace('VWire', topology)}
          </h2>
        </div>

        <div
          className="inline-flex rounded-lg p-0.5 text-[11px] font-medium"
          style={{
            backgroundColor: isDark ? '#070b18' : '#eef2ff',
            border: `1px solid ${isDark ? '#1d2949' : '#dce2f5'}`,
          }}
        >
          {TOPOLOGY_MODES.map((item) => {
            const active = topology === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setTopology(item)}
                className="rounded-md px-2 py-0.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: active ? (isDark ? `${accent}24` : '#ffffff') : 'transparent',
                  color: active ? (isDark ? accent : '#4f46e5') : isDark ? '#94a3b8' : '#64748b',
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pipeline diagram */}
      <div
        className="relative flex flex-1 items-center justify-between gap-2 rounded-xl px-3 py-6 sm:px-5"
        style={{
          background: isDark
            ? `linear-gradient(135deg, rgba(16, 24, 50, 0.9), rgba(7, 11, 24, 0.95))`
            : 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
          border: `1px solid ${isDark ? `${accent}26` : 'rgba(99, 102, 241, 0.16)'}`,
        }}
      >
        {/* Connecting animated SVG overlay */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 400 120"
        >
          <line
            x1="58"
            y1="54"
            x2="328"
            y2="54"
            stroke={isDark ? accent : '#4f46e5'}
            strokeWidth="1.6"
            strokeOpacity={isDark ? 0.65 : 0.45}
            className="nuxlab-flow-line"
          />
        </svg>

        {/* Step 1: Modem */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div
            className="grid h-12 w-12 place-items-center rounded-xl border"
            style={{
              backgroundColor: isDark ? '#0c1328' : '#ffffff',
              borderColor: isDark ? `${accent}50` : 'rgba(79, 70, 229, 0.25)',
              color: isDark ? accent : '#4f46e5',
            }}
          >
            <Server className="h-5 w-5" />
          </div>
          <span
            className="text-xs font-medium"
            style={{color: isDark ? '#cbd5e1' : '#312e81'}}
          >
            Modem
          </span>
        </div>

        {/* Check badge */}
        <div
          className="relative z-10 -mt-5 grid h-5 w-5 place-items-center rounded-full border"
          style={{
            backgroundColor: isDark ? '#0b1022' : '#eef2ff',
            borderColor: isDark ? '#10f5a8' : '#4f46e5',
            color: isDark ? '#10f5a8' : '#4f46e5',
          }}
        >
          <Check className="h-3 w-3" />
        </div>

        {/* Step 2: NuxLab Core */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div
            className="grid h-12 w-12 place-items-center rounded-xl border"
            style={{
              backgroundColor: isDark ? '#101836' : '#ffffff',
              borderColor: isDark ? secondaryAccent : '#4f46e5',
              boxShadow: isDark ? `0 0 18px -4px ${secondaryAccent}66` : '0 6px 14px -4px rgba(79, 70, 229, 0.25)',
            }}
          >
            <img src="/htdocs/luci-static/nuxlab/img/nuxlab.svg" alt="NuxLab" className="h-7 w-7 rounded-md" />
          </div>
          <span
            className="text-xs font-semibold"
            style={{color: isDark ? '#f1f5f9' : '#312e81'}}
          >
            NuxLab Core
          </span>
        </div>

        {/* Check badge */}
        <div
          className="relative z-10 -mt-5 grid h-5 w-5 place-items-center rounded-full border"
          style={{
            backgroundColor: isDark ? '#0b1022' : '#eef2ff',
            borderColor: isDark ? '#10f5a8' : '#4f46e5',
            color: isDark ? '#10f5a8' : '#4f46e5',
          }}
        >
          <Check className="h-3 w-3" />
        </div>

        {/* Step 3: Router */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div
            className="grid h-12 w-12 place-items-center rounded-xl border"
            style={{
              backgroundColor: isDark ? '#0c1328' : '#ffffff',
              borderColor: isDark ? `${accent}50` : 'rgba(79, 70, 229, 0.25)',
              color: isDark ? accent : '#4f46e5',
            }}
          >
            <Router className="h-5 w-5" />
          </div>
          <span
            className="text-xs font-medium"
            style={{color: isDark ? '#cbd5e1' : '#312e81'}}
          >
            OpenWrt
          </span>
        </div>

        {/* Step 4: Client Devices */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div
            className="flex flex-col gap-1 rounded-xl border p-1.5"
            style={{
              backgroundColor: isDark ? '#0c1328' : '#ffffff',
              borderColor: isDark ? '#1d2949' : 'rgba(79, 70, 229, 0.2)',
              color: isDark ? '#94a3b8' : '#4f46e5',
            }}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <Laptop className="h-3.5 w-3.5" />
          </div>
          <span className="text-[10px] font-mono-num" style={{color: isDark ? '#94a3b8' : '#4338ca'}}>
            14 LAN
          </span>
        </div>
      </div>

      {/* Sub-telemetry bar */}
      <div className="mt-3 flex items-center justify-between text-[11px] font-mono-num" style={{color: isDark ? '#94a3b8' : '#64748b'}}>
        <span>
          WAN: <strong style={{color: isDark ? '#10f5a8' : '#059669'}}>LINK UP · 1000Mb/s</strong>
        </span>
        <span>
          MTU: <strong style={{color: isDark ? '#e2e8f0' : '#1e293b'}}>1500</strong>
        </span>
      </div>
    </section>
  );
};
