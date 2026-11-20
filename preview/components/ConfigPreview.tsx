import React, {useState} from 'react';
import {CheckCircle2, Palette, RefreshCw, Sliders} from 'lucide-react';
import {NuxLabSettings} from '../types.ts';

interface Props {
  settings: NuxLabSettings;
  onUpdate: (patch: Partial<NuxLabSettings>) => void;
}

export const ConfigPreview: React.FC<Props> = ({settings, onUpdate}) => {
  const isDark = settings.mode === 'dark';
  const accent = isDark ? settings.darkNeon : settings.lightPrimary;
  const [savedNotice, setSavedNotice] = useState(false);

  const cardStyle: React.CSSProperties = {
    backgroundColor: isDark ? '#0b1022' : 'rgba(255, 255, 255, 0.92)',
    borderColor: isDark ? `${accent}36` : 'rgba(79, 70, 229, 0.14)',
    boxShadow: isDark
      ? `0 0 0 1px ${accent}1a, 0 16px 36px -12px rgba(0, 0, 0, 0.72)`
      : '0 10px 30px -10px rgba(49, 46, 129, 0.10)',
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2200);
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {/* Header Map Card */}
      <section className="rounded-2xl border p-5" style={cardStyle}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold" style={{color: isDark ? '#f1f5f9' : '#1e293b'}}>
              NuxLab Theme Configuration (luci-app-nuxlab)
            </h2>
            <p className="mt-1 text-xs" style={{color: isDark ? '#94a3b8' : '#64748b'}}>
              Route: <code className="font-mono-num">/admin/system/nuxlab</code> · UCI Package:{' '}
              <code className="font-mono-num">nuxlab.@global[0]</code>
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono-num text-xs font-semibold"
            style={{
              backgroundColor: isDark ? 'rgba(16, 245, 168, 0.14)' : '#ecfdf5',
              color: isDark ? '#10f5a8' : '#059669',
              border: `1px solid ${isDark ? 'rgba(16, 245, 168, 0.35)' : '#a7f3d0'}`,
            }}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            v1.0.0 Up to date
          </span>
        </div>
      </section>

      {/* Main CBI Settings Section */}
      <section className="rounded-2xl border p-5 space-y-5" style={cardStyle}>
        <div className="flex items-center gap-2 border-b pb-3" style={{borderColor: isDark ? '#182242' : '#e8ecfb'}}>
          <Sliders className="h-4 w-4" style={{color: accent}} />
          <h3 className="text-sm font-semibold" style={{color: isDark ? '#f1f5f9' : '#1e293b'}}>
            Theme & Cyberpunk Neon Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Theme Mode */}
          <label className="space-y-1.5 text-xs">
            <span className="font-semibold block" style={{color: isDark ? '#cbd5e1' : '#334155'}}>
              Theme Mode
            </span>
            <select
              value={settings.mode}
              onChange={(e) => onUpdate({mode: e.target.value as 'light' | 'dark'})}
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={{
                backgroundColor: isDark ? '#070b18' : '#ffffff',
                borderColor: isDark ? '#273452' : '#dce2f5',
                color: isDark ? '#f1f5f9' : '#1e293b',
              }}
            >
              <option value="light">Light mode (Frost Indigo)</option>
              <option value="dark">Dark mode (Cyberpunk Neon)</option>
            </select>
          </label>

          {/* Login Style */}
          <label className="space-y-1.5 text-xs">
            <span className="font-semibold block" style={{color: isDark ? '#cbd5e1' : '#334155'}}>
              Login Page Style
            </span>
            <select
              value={settings.loginStyle}
              onChange={(e) => onUpdate({loginStyle: e.target.value as 'classic' | 'centered'})}
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
              style={{
                backgroundColor: isDark ? '#070b18' : '#ffffff',
                borderColor: isDark ? '#273452' : '#dce2f5',
                color: isDark ? '#f1f5f9' : '#1e293b',
              }}
            >
              <option value="classic">Classic sidebar</option>
              <option value="centered">Centered card</option>
            </select>
          </label>

          {/* Primary Light Color */}
          <div className="space-y-1.5 text-xs">
            <span className="font-semibold block" style={{color: isDark ? '#cbd5e1' : '#334155'}}>
              Primary Color (Light Mode)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={settings.lightPrimary}
                onChange={(e) => onUpdate({lightPrimary: e.target.value})}
                className="flex-1 rounded-xl border px-3 py-2 font-mono-num text-sm outline-none"
                style={{
                  backgroundColor: isDark ? '#070b18' : '#ffffff',
                  borderColor: isDark ? '#273452' : '#dce2f5',
                  color: isDark ? '#f1f5f9' : '#1e293b',
                }}
              />
              <input
                type="color"
                value={settings.lightPrimary}
                onChange={(e) => onUpdate({lightPrimary: e.target.value})}
                className="h-10 w-10 cursor-pointer rounded-xl border p-0.5"
                style={{borderColor: isDark ? '#273452' : '#dce2f5'}}
              />
            </div>
          </div>

          {/* Dark Neon Color */}
          <div className="space-y-1.5 text-xs">
            <span className="font-semibold block" style={{color: isDark ? '#cbd5e1' : '#334155'}}>
              [Dark Mode] Cyberpunk Neon Primary
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={settings.darkNeon}
                onChange={(e) => onUpdate({darkNeon: e.target.value})}
                className="flex-1 rounded-xl border px-3 py-2 font-mono-num text-sm outline-none"
                style={{
                  backgroundColor: isDark ? '#070b18' : '#ffffff',
                  borderColor: isDark ? '#273452' : '#dce2f5',
                  color: isDark ? '#f1f5f9' : '#1e293b',
                }}
              />
              <input
                type="color"
                value={settings.darkNeon}
                onChange={(e) => onUpdate({darkNeon: e.target.value})}
                className="h-10 w-10 cursor-pointer rounded-xl border p-0.5"
                style={{borderColor: isDark ? '#273452' : '#dce2f5'}}
              />
            </div>
          </div>

          {/* Blur Slider */}
          <label className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="font-semibold" style={{color: isDark ? '#cbd5e1' : '#334155'}}>
                Login Panel Blur Radius
              </span>
              <span className="font-mono-num" style={{color: accent}}>
                {settings.blur}px
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              value={settings.blur}
              onChange={(e) => onUpdate({blur: Number(e.target.value)})}
              className="w-full accent-cyan-400"
            />
          </label>

          {/* Opacity Slider */}
          <label className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="font-semibold" style={{color: isDark ? '#cbd5e1' : '#334155'}}>
                Login Panel Opacity
              </span>
              <span className="font-mono-num" style={{color: accent}}>
                {settings.opacity.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.1}
              value={settings.opacity}
              onChange={(e) => onUpdate({opacity: Number(e.target.value)})}
              className="w-full accent-cyan-400"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {savedNotice ? (
            <span className="text-xs font-semibold" style={{color: isDark ? '#10f5a8' : '#059669'}}>
              UCI config changes applied live to preview!
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs" style={{color: isDark ? '#94a3b8' : '#64748b'}}>
              <Palette className="h-3.5 w-3.5" />
              Semua perubahan langsung terlihat di Dasbor & Login preview.
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onUpdate({
                  mode: 'dark',
                  lightPrimary: '#4f46e5',
                  darkNeon: '#00e5ff',
                  darkSecondary: '#d946ef',
                  loginStyle: 'classic',
                  blur: 10,
                  opacity: 0.65,
                })
              }
              className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold cursor-pointer"
              style={{
                borderColor: isDark ? '#273452' : '#dce2f5',
                color: isDark ? '#cbd5e1' : '#334155',
              }}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Default
            </button>
            <button
              type="submit"
              className="rounded-xl px-4 py-2 text-xs font-semibold cursor-pointer transition-transform active:scale-95"
              style={{
                backgroundColor: accent,
                color: isDark ? '#040814' : '#ffffff',
                boxShadow: isDark ? `0 0 18px -4px ${accent}88` : '0 6px 16px -4px rgba(79, 70, 229, 0.35)',
              }}
            >
              Save & Apply
            </button>
          </div>
        </div>
      </section>
    </form>
  );
};
