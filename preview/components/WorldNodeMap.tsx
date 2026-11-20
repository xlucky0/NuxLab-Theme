import React, {useMemo, useState} from 'react';
import {Globe2, ShieldCheck, Zap} from 'lucide-react';
import {COPY, LangCode, ThemeMode} from '../types.ts';

interface NodePoint {
  id: string;
  name: string;
  region: string;
  x: number;
  y: number;
  latency: number;
  kind: 'primary' | 'active' | 'relay';
}

const ACTIVE_NODES: NodePoint[] = [
  {id: 'us-west', name: 'US-West-04', region: 'San Jose, US', x: 148, y: 112, latency: 132, kind: 'active'},
  {id: 'us-east', name: 'US-East-01', region: 'Ashburn, US', x: 222, y: 108, latency: 158, kind: 'active'},
  {id: 'br-sp', name: 'SA-South-02', region: 'Sao Paulo, BR', x: 274, y: 214, latency: 218, kind: 'active'},
  {id: 'uk-lon', name: 'EU-West-01', region: 'London, UK', x: 406, y: 84, latency: 118, kind: 'active'},
  {id: 'de-fra', name: 'EU-Central-03', region: 'Frankfurt, DE', x: 432, y: 92, latency: 112, kind: 'active'},
  {id: 'ae-dxb', name: 'ME-Gulf-01', region: 'Dubai, AE', x: 516, y: 136, latency: 94, kind: 'active'},
  {id: 'in-bom', name: 'IN-West-03', region: 'Mumbai, IN', x: 562, y: 152, latency: 58, kind: 'active'},
  {id: 'sg-core', name: 'NuxLab-SG-Core', region: 'Singapore, SG', x: 618, y: 174, latency: 14, kind: 'primary'},
  {id: 'jp-tyo', name: 'AP-East-02', region: 'Tokyo, JP', x: 686, y: 106, latency: 46, kind: 'active'},
  {id: 'kr-icn', name: 'AP-Seoul-01', region: 'Seoul, KR', x: 664, y: 108, latency: 52, kind: 'relay'},
  {id: 'id-jkt', name: 'ID-Edge-01', region: 'Jakarta, ID', x: 626, y: 194, latency: 8, kind: 'primary'},
  {id: 'au-syd', name: 'OC-South-01', region: 'Sydney, AU', x: 706, y: 236, latency: 74, kind: 'active'},
];

// Lightweight continent bounding boxes & ellipses for a crisp dot-matrix world map
const LANDMASSES: Array<[number, number, number, number]> = [
  // North America
  [115, 72, 68, 34],
  [172, 102, 54, 30],
  [196, 134, 24, 18],
  [215, 62, 34, 18],
  // South America
  [248, 178, 34, 26],
  [264, 212, 26, 34],
  [258, 250, 14, 20],
  // Europe
  [400, 74, 48, 28],
  [446, 66, 36, 22],
  // Africa
  [424, 142, 48, 28],
  [454, 178, 32, 36],
  [460, 218, 20, 22],
  // Asia
  [496, 74, 88, 36],
  [584, 82, 86, 34],
  [544, 126, 56, 32],
  [608, 124, 54, 32],
  [682, 104, 14, 18],
  // Maritime SE Asia
  [616, 176, 34, 18],
  // Australia
  [678, 224, 40, 24],
];

interface Props {
  mode: ThemeMode;
  lang: LangCode;
  accent: string;
  secondaryAccent: string;
}

export const WorldNodeMap: React.FC<Props> = ({mode, lang, accent, secondaryAccent}) => {
  const t = COPY[lang];
  const isDark = mode === 'dark';
  const [selectedNode, setSelectedNode] = useState<NodePoint>(ACTIVE_NODES[7]);

  const dots = useMemo(() => {
    const pts: Array<{x: number; y: number; hot: boolean}> = [];
    const stepX = 11;
    const stepY = 10;
    for (let row = 0; row < 28; row++) {
      const y = 26 + row * stepY;
      const offset = row % 2 === 0 ? 0 : stepX / 2;
      for (let col = 0; col < 72; col++) {
        const x = 32 + col * stepX + offset;
        const inLand = LANDMASSES.some(([cx, cy, rx, ry]) => {
          const dx = (x - cx) / rx;
          const dy = (y - cy) / ry;
          return dx * dx + dy * dy <= 1.0;
        });
        if (inLand) {
          const nearHot = (row * 7 + col * 13) % 19 === 0;
          pts.push({x, y, hot: nearHot});
        }
      }
    }
    return pts;
  }, []);

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
      {/* Top cyber neon hairline in dark mode */}
      {isDark && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[1px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${accent}, ${secondaryAccent}, transparent)`,
            opacity: 0.75,
          }}
        />
      )}

      {/* Header bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Globe2 className="h-4 w-4 shrink-0" style={{color: accent}} />
          <h2
            className="text-sm font-semibold tracking-tight truncate"
            style={{color: isDark ? '#f1f5f9' : '#1e293b'}}
          >
            {t.routeMode}
          </h2>
          <span
            className="hidden sm:inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium font-mono-num"
            style={{
              backgroundColor: isDark ? `${accent}18` : 'rgba(79, 70, 229, 0.08)',
              color: isDark ? accent : '#4338ca',
              border: `1px solid ${isDark ? `${accent}40` : 'rgba(79, 70, 229, 0.18)'}`,
            }}
          >
            <Zap className="h-3 w-3" />
            {selectedNode.name} · {selectedNode.latency}ms
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div
            className="rounded-lg px-2.5 py-1 font-mono-num font-medium whitespace-nowrap"
            style={{
              backgroundColor: isDark ? '#101832' : '#f1f5ff',
              border: `1px solid ${isDark ? '#1e2c54' : '#e0e7ff'}`,
              color: isDark ? '#cbd5e1' : '#334155',
            }}
          >
            {t.nodesCount} : <span style={{color: accent}}>107,841</span>
          </div>
          <div
            className="rounded-lg px-2.5 py-1 font-mono-num font-medium whitespace-nowrap"
            style={{
              backgroundColor: isDark ? '#101832' : '#f1f5ff',
              border: `1px solid ${isDark ? '#1e2c54' : '#e0e7ff'}`,
              color: isDark ? '#cbd5e1' : '#334155',
            }}
          >
            {t.usingCount} : <span style={{color: accent}}>15 {t.countries}</span> /{' '}
            <span style={{color: isDark ? secondaryAccent : '#1e293b'}}>4 {t.nodesCount}</span>
          </div>
        </div>
      </div>

      {/* Dot-matrix SVG World Map */}
      <div className="relative w-full overflow-hidden rounded-xl" style={{backgroundColor: isDark ? '#070b18' : '#f7f9ff'}}>
        <svg viewBox="0 0 800 285" className="block h-auto w-full select-none" role="img" aria-label="Global node mesh map">
          {isDark && (
            <defs>
              <radialGradient id="nuxlab-map-glow" cx="62%" cy="60%" r="48%">
                <stop offset="0%" stopColor={accent} stopOpacity="0.14" />
                <stop offset="65%" stopColor={secondaryAccent} stopOpacity="0.05" />
                <stop offset="100%" stopColor="transparent" stopOpacity="0" />
              </radialGradient>
            </defs>
          )}
          {isDark && <rect x="0" y="0" width="800" height="285" fill="url(#nuxlab-map-glow)" />}

          {/* Subtle Cyber latitude lines */}
          {[70, 140, 210].map((y) => (
            <line
              key={y}
              x1="20"
              y1={y}
              x2="780"
              y2={y}
              stroke={isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(99, 102, 241, 0.07)'}
              strokeDasharray="3 5"
            />
          ))}

          {/* Dot-matrix landmasses */}
          <g>
            {dots.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={pt.hot ? 2.4 : 1.9}
                fill={
                  pt.hot
                    ? isDark
                      ? `${secondaryAccent}88`
                      : 'rgba(249, 115, 22, 0.45)'
                    : isDark
                      ? 'rgba(148, 163, 184, 0.25)'
                      : 'rgba(99, 102, 241, 0.23)'
                }
              />
            ))}
          </g>

          {/* Mesh connection arcs from core node */}
          {ACTIVE_NODES.filter((n) => n.id !== 'sg-core').map((node) => {
            const core = ACTIVE_NODES[7];
            const isSelected = selectedNode.id === node.id;
            const midX = (core.x + node.x) / 2;
            const midY = Math.min(core.y, node.y) - 24;
            return (
              <path
                key={node.id}
                d={`M ${core.x} ${core.y} Q ${midX} ${midY} ${node.x} ${node.y}`}
                fill="none"
                stroke={isSelected ? accent : isDark ? `${accent}45` : 'rgba(79, 70, 229, 0.24)'}
                strokeWidth={isSelected ? 1.6 : 0.9}
                className={isSelected ? 'nuxlab-flow-line' : undefined}
              />
            );
          })}

          {/* Interactive Global Node Markers */}
          {ACTIVE_NODES.map((node) => {
            const isPrimary = node.kind === 'primary';
            const isSelected = selectedNode.id === node.id;
            const markerColor = isPrimary
              ? isDark
                ? secondaryAccent
                : '#f59e0b'
              : isDark
                ? '#10f5a8'
                : '#22c55e';

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onClick={() => setSelectedNode(node)}
                onMouseEnter={() => setSelectedNode(node)}
              >
                {(isPrimary || isSelected) && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isPrimary ? 10 : 8}
                    fill={markerColor}
                    fillOpacity="0.28"
                    className="nuxlab-node-ring"
                  />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isPrimary ? 5.2 : isSelected ? 4.8 : 3.6}
                  fill={markerColor}
                  stroke={isDark ? '#060812' : '#ffffff'}
                  strokeWidth="1.5"
                />
              </g>
            );
          })}
        </svg>

        {/* Bottom-left selected node HUD overlay */}
        <div
          className="absolute bottom-2.5 left-2.5 flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11px]"
          style={{
            backgroundColor: isDark ? 'rgba(9, 13, 27, 0.88)' : 'rgba(255, 255, 255, 0.92)',
            border: `1px solid ${isDark ? `${accent}40` : 'rgba(79, 70, 229, 0.16)'}`,
            color: isDark ? '#e2e8f0' : '#1e293b',
          }}
        >
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" style={{color: isDark ? '#10f5a8' : '#10b981'}} />
          <span className="font-semibold">{selectedNode.name}</span>
          <span className="opacity-70">{selectedNode.region}</span>
          <span className="font-mono-num font-semibold" style={{color: accent}}>
            {selectedNode.latency} ms
          </span>
        </div>
      </div>
    </section>
  );
};
