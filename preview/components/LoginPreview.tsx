import React, {useState} from 'react';
import {Lock, LogIn, Sparkles, User} from 'lucide-react';
import {NuxLabSettings} from '../types.ts';

interface Props {
  settings: NuxLabSettings;
  onUpdate: (patch: Partial<NuxLabSettings>) => void;
  onEnterDashboard: () => void;
}

export const LoginPreview: React.FC<Props> = ({settings, onUpdate, onEnterDashboard}) => {
  const isDark = settings.mode === 'dark';
  const accent = isDark ? settings.darkNeon : settings.lightPrimary;
  const [username, setUsername] = useState('root');
  const [password, setPassword] = useState('••••••••');

  return (
    <div className="space-y-4">
      {/* Quick layout switcher */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-xs"
        style={{
          backgroundColor: isDark ? '#0b1022' : 'rgba(255, 255, 255, 0.92)',
          borderColor: isDark ? `${accent}36` : 'rgba(79, 70, 229, 0.14)',
        }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" style={{color: accent}} />
          <span className="font-semibold" style={{color: isDark ? '#f1f5f9' : '#1e293b'}}>
            ucode/template/themes/nuxlab/sysauth.ut
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg p-0.5" style={{backgroundColor: isDark ? '#070b18' : '#eef2ff'}}>
            {(['classic', 'centered'] as const).map((style) => {
              const active = settings.loginStyle === style;
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => onUpdate({loginStyle: style})}
                  className="rounded-md px-3 py-1 font-medium capitalize cursor-pointer transition-colors"
                  style={{
                    backgroundColor: active ? accent : 'transparent',
                    color: active ? (isDark ? '#040814' : '#ffffff') : isDark ? '#94a3b8' : '#475569',
                  }}
                >
                  {style === 'classic' ? 'Classic Sidebar' : 'Centered Card'}
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-2 font-mono-num" style={{color: isDark ? '#cbd5e1' : '#334155'}}>
            <span>Blur: {settings.blur}px</span>
            <input
              type="range"
              min={0}
              max={24}
              value={settings.blur}
              onChange={(e) => onUpdate({blur: Number(e.target.value)})}
              className="w-20 accent-cyan-400"
            />
          </label>
        </div>
      </div>

      {/* Simulated Login Viewport */}
      <div
        className={`relative flex min-h-[540px] w-full overflow-hidden rounded-2xl border ${
          settings.loginStyle === 'centered' ? 'items-center justify-center p-6' : 'items-stretch justify-start'
        }`}
        style={{
          borderColor: isDark ? `${accent}44` : 'rgba(79, 70, 229, 0.18)',
          background: isDark
            ? `radial-gradient(circle at 75% 25%, ${settings.darkSecondary}35 0%, transparent 45%), radial-gradient(circle at 25% 80%, ${accent}30 0%, transparent 50%), linear-gradient(135deg, #040711 0%, #0d1430 55%, #160c2e 100%)`
            : 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.34) 0%, transparent 45%), linear-gradient(135deg, #c7d2fe 0%, #e0e7ff 45%, #ddd6fe 100%)',
        }}
      >
        {/* Lightweight Cyber Grid SVG Wallpaper */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          preserveAspectRatio="none"
          viewBox="0 0 1200 640"
        >
          <defs>
            <pattern id="cyber-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path
                d="M 48 0 L 0 0 0 48"
                fill="none"
                stroke={isDark ? accent : '#4f46e5'}
                strokeOpacity={isDark ? 0.25 : 0.18}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="1200" height="640" fill="url(#cyber-grid)" />
          <circle
            cx="920"
            cy="210"
            r="150"
            fill="none"
            stroke={isDark ? settings.darkSecondary : '#4f46e5'}
            strokeOpacity="0.3"
            strokeWidth="1.5"
            strokeDasharray="6 6"
          />
          <circle
            cx="920"
            cy="210"
            r="105"
            fill="none"
            stroke={accent}
            strokeOpacity="0.4"
            strokeWidth="1.5"
          />
        </svg>

        {/* Glass Login Panel */}
        <div
          className={`relative z-10 flex flex-col justify-between transition-all duration-200 ${
            settings.loginStyle === 'centered'
              ? 'w-full max-w-[390px] rounded-2xl border p-8'
              : 'w-full max-w-[380px] sm:ml-[6%] border-x p-8 sm:p-10'
          }`}
          style={{
            backgroundColor: isDark
              ? `rgba(6, 10, 22, ${settings.opacity})`
              : `rgba(248, 250, 255, ${settings.opacity})`,
            backdropFilter: `blur(${settings.blur}px)`,
            WebkitBackdropFilter: `blur(${settings.blur}px)`,
            borderColor: isDark ? `${accent}44` : 'rgba(255, 255, 255, 0.72)',
            boxShadow: isDark
              ? `0 24px 60px -12px rgba(0, 0, 0, 0.8), 0 0 30px -10px ${accent}33`
              : '0 24px 56px -12px rgba(49, 46, 129, 0.25)',
          }}
        >
          <div className="flex items-center gap-4">
            <img src="/htdocs/luci-static/nuxlab/img/nuxlab.svg" alt="NuxLab" className="h-12 w-12 rounded-xl" />
            <div>
              <div
                className="font-display text-xl font-bold tracking-tight"
                style={{color: isDark ? '#f8fafc' : '#0f172a'}}
              >
                NuxLab-Router
              </div>
              <div className="font-mono-num text-[11px]" style={{color: isDark ? accent : '#4f46e5'}}>
                OpenWrt LuCI · Cyberpunk Edition
              </div>
            </div>
          </div>

          <form
            className="my-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              onEnterDashboard();
            }}
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{color: isDark ? '#cbd5e1' : '#334155'}}>
                Username
              </label>
              <div className="relative">
                <User
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{color: isDark ? accent : '#4f46e5'}}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-shadow"
                  style={{
                    backgroundColor: isDark ? 'rgba(9, 13, 27, 0.75)' : 'rgba(255, 255, 255, 0.82)',
                    borderColor: isDark ? `${accent}44` : '#cbd5e1',
                    color: isDark ? '#f8fafc' : '#0f172a',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{color: isDark ? '#cbd5e1' : '#334155'}}>
                Password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{color: isDark ? accent : '#4f46e5'}}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-shadow"
                  style={{
                    backgroundColor: isDark ? 'rgba(9, 13, 27, 0.75)' : 'rgba(255, 255, 255, 0.82)',
                    borderColor: isDark ? `${accent}44` : '#cbd5e1',
                    color: isDark ? '#f8fafc' : '#0f172a',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold cursor-pointer transition-transform active:scale-[0.98]"
              style={{
                backgroundColor: accent,
                color: isDark ? '#040814' : '#ffffff',
                boxShadow: isDark ? `0 0 24px -4px ${accent}99` : '0 10px 24px -6px rgba(79, 70, 229, 0.45)',
              }}
            >
              <LogIn className="h-4 w-4" />
              Masuk ke Dasbor NuxLab
            </button>
          </form>

          <footer className="text-center text-[11px]" style={{color: isDark ? '#94a3b8' : '#475569'}}>
            Powered by LuCI · NuxLab v1.0.0 · Apache-2.0
          </footer>
        </div>
      </div>
    </div>
  );
};
