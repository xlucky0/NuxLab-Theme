import React, {useEffect, useMemo, useState} from 'react';
import {Activity, Pause, Play} from 'lucide-react';
import {COPY, LangCode, ThemeMode} from '../types.ts';

interface TrafficSample {
  time: string;
  down: number;
  up: number;
}

const INITIAL_SAMPLES: TrafficSample[] = [
  {time: '21:33', down: 34, up: 28},
  {time: '21:33', down: 41, up: 32},
  {time: '21:33', down: 24, up: 18},
  {time: '21:33', down: 39, up: 35},
  {time: '21:33', down: 29, up: 22},
  {time: '21:33', down: 43, up: 37},
  {time: '21:33', down: 31, up: 25},
  {time: '21:33', down: 40, up: 29},
  {time: '21:34', down: 27, up: 19},
  {time: '21:34', down: 37, up: 31},
  {time: '21:34', down: 33, up: 26},
  {time: '21:34', down: 44, up: 38},
  {time: '21:34', down: 29, up: 21},
  {time: '21:34', down: 38, up: 34},
  {time: '21:34', down: 42, up: 33},
  {time: '21:35', down: 30, up: 24},
];

interface Props {
  mode: ThemeMode;
  lang: LangCode;
  accent: string;
  secondaryAccent: string;
}

export const TrafficChart: React.FC<Props> = ({mode, lang, accent, secondaryAccent}) => {
  const t = COPY[lang];
  const isDark = mode === 'dark';
  const [samples, setSamples] = useState<TrafficSample[]>(INITIAL_SAMPLES);
  const [streaming, setStreaming] = useState(true);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!streaming) return;
    const timer = window.setInterval(() => {
      setSamples((prev) => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const last = prev[prev.length - 1];
        const nextDown = Math.max(16, Math.min(72, Math.round(last.down + (Math.random() - 0.48) * 18)));
        const nextUp = Math.max(10, Math.min(54, Math.round(last.up + (Math.random() - 0.5) * 14)));
        return [...prev.slice(1), {time: `${hh}:${mm}`, down: nextDown, up: nextUp}];
      });
    }, 2000);
    return () => window.clearInterval(timer);
  }, [streaming]);

  const width = 640;
  const height = 180;
  const padL = 42;
  const padR = 12;
  const padT = 14;
  const padB = 26;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const maxY = 80;

  const {downLine, downArea, upLine, upArea, coords} = useMemo(() => {
    const pts = samples.map((s, idx) => {
      const x = padL + (idx / (samples.length - 1)) * innerW;
      const yDown = padT + innerH - (s.down / maxY) * innerH;
      const yUp = padT + innerH - (s.up / maxY) * innerH;
      return {x, yDown, yUp, sample: s};
    });

    const smoothPath = (points: Array<{x: number; y: number}>) => {
      if (points.length === 0) return '';
      let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];
        const cx = (p0.x + p1.x) / 2;
        d += ` C ${cx.toFixed(1)} ${p0.y.toFixed(1)}, ${cx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
      }
      return d;
    };

    const downPts = pts.map((p) => ({x: p.x, y: p.yDown}));
    const upPts = pts.map((p) => ({x: p.x, y: p.yUp}));
    const baseLineY = (padT + innerH).toFixed(1);
    const dLine = smoothPath(downPts);
    const uLine = smoothPath(upPts);
    const dArea = `${dLine} L ${downPts[downPts.length - 1].x.toFixed(1)} ${baseLineY} L ${downPts[0].x.toFixed(1)} ${baseLineY} Z`;
    const uArea = `${uLine} L ${upPts[upPts.length - 1].x.toFixed(1)} ${baseLineY} L ${upPts[0].x.toFixed(1)} ${baseLineY} Z`;

    return {downLine: dLine, downArea: dArea, upLine: uLine, upArea: uArea, coords: pts};
  }, [samples, innerH, innerW]);

  const activePoint = hoverIdx !== null ? coords[hoverIdx] : coords[coords.length - 1];
  const downColor = isDark ? accent : '#10b981';
  const upColor = isDark ? secondaryAccent : '#f59e0b';

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
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Activity className="h-4 w-4 shrink-0" style={{color: accent}} />
          <h3 className="text-sm font-semibold tracking-tight truncate" style={{color: isDark ? '#f1f5f9' : '#1e293b'}}>
            {t.realtimeTraffic}
          </h3>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-mono-num">
            <span className="inline-block h-2 w-2 rounded-full" style={{backgroundColor: downColor}} />
            <span style={{color: isDark ? '#cbd5e1' : '#334155'}}>{t.download}</span>
            <strong style={{color: downColor}}>{activePoint.sample.down} KB/s</strong>
          </div>
          <div className="flex items-center gap-1.5 font-mono-num">
            <span className="inline-block h-2 w-2 rounded-full" style={{backgroundColor: upColor}} />
            <span style={{color: isDark ? '#cbd5e1' : '#334155'}}>{t.upload}</span>
            <strong style={{color: upColor}}>{activePoint.sample.up} KB/s</strong>
          </div>
          <button
            type="button"
            onClick={() => setStreaming((v) => !v)}
            aria-label={streaming ? 'Pause stream' : 'Resume stream'}
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg border cursor-pointer transition-colors"
            style={{
              backgroundColor: isDark ? '#101832' : '#eef2ff',
              borderColor: isDark ? '#1e2c54' : '#dce2f5',
              color: isDark ? accent : '#4f46e5',
            }}
          >
            {streaming ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="block h-auto w-full select-none"
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="nuxlab-down-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={downColor} stopOpacity={isDark ? 0.36 : 0.32} />
              <stop offset="100%" stopColor={downColor} stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="nuxlab-up-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={upColor} stopOpacity={isDark ? 0.28 : 0.22} />
              <stop offset="100%" stopColor={upColor} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Y grid */}
          {[20, 40, 60, 80].map((val) => {
            const y = padT + innerH - (val / maxY) * innerH;
            return (
              <g key={val}>
                <line
                  x1={padL}
                  y1={y}
                  x2={width - padR}
                  y2={y}
                  stroke={isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(99, 102, 241, 0.10)'}
                  strokeDasharray="3 4"
                />
                <text
                  x={padL - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                  fill={isDark ? '#64748b' : '#64748b'}
                >
                  {val}KB
                </text>
              </g>
            );
          })}

          <path d={upArea} fill="url(#nuxlab-up-fill)" />
          <path d={downArea} fill="url(#nuxlab-down-fill)" />
          <path d={upLine} fill="none" stroke={upColor} strokeWidth="2" />
          <path d={downLine} fill="none" stroke={downColor} strokeWidth="2.2" />

          {/* Hover vertical guideline & interactive columns */}
          {hoverIdx !== null && (
            <g>
              <line
                x1={activePoint.x}
                y1={padT}
                x2={activePoint.x}
                y2={padT + innerH}
                stroke={isDark ? `${accent}88` : '#4f46e5'}
                strokeDasharray="3 3"
              />
              <circle cx={activePoint.x} cy={activePoint.yDown} r="4" fill={downColor} stroke="#fff" strokeWidth="1.5" />
              <circle cx={activePoint.x} cy={activePoint.yUp} r="4" fill={upColor} stroke="#fff" strokeWidth="1.5" />
            </g>
          )}

          {/* X-axis timestamps */}
          {coords.map((pt, idx) =>
            idx % 2 === 0 ? (
              <text
                key={idx}
                x={pt.x}
                y={height - 6}
                textAnchor="middle"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fill={isDark ? '#64748b' : '#64748b'}
              >
                {pt.sample.time}
              </text>
            ) : null,
          )}

          {/* Hover hit zones */}
          {coords.map((pt, idx) => (
            <rect
              key={`hit-${idx}`}
              x={pt.x - innerW / samples.length / 2}
              y={padT}
              width={innerW / samples.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHoverIdx(idx)}
            />
          ))}
        </svg>
      </div>
    </section>
  );
};
