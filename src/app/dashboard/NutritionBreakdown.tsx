"use client";

import { useEffect, useState } from "react";

interface MacroStats {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium?: number;
  sugar?: number;
}

interface Stats {
  macros: MacroStats;
  dailyGoal: number;
  totalCalories: number;
}

const MACROS = [
  { key: "protein" as const, label: "Protein", unit: "g", color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.3)", emoji: "🥩", targetPct: 0.30, calPerG: 4 },
  { key: "carbs" as const, label: "Karbohidrat", unit: "g", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.3)", emoji: "🌾", targetPct: 0.45, calPerG: 4 },
  { key: "fat" as const, label: "Yog'", unit: "g", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.3)", emoji: "🫒", targetPct: 0.25, calPerG: 9 },
  { key: "fiber" as const, label: "Tola", unit: "g", color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.3)", emoji: "🥦", targetPct: null, calPerG: 0, fixedTarget: 28 },
];

export default function NutritionBreakdown() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) setStats(await res.json());
      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="section-header">
          <div className="section-header-icon">🥗</div>
          Makronutrientlar
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '72px' }} />)}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const macroCalories = {
    protein: (stats.macros.protein || 0) * 4,
    carbs: (stats.macros.carbs || 0) * 4,
    fat: (stats.macros.fat || 0) * 9,
  };
  const totalMacroCalories = macroCalories.protein + macroCalories.carbs + macroCalories.fat;
  const proteinPct = totalMacroCalories > 0 ? (macroCalories.protein / totalMacroCalories) * 100 : 33;
  const carbsPct = totalMacroCalories > 0 ? (macroCalories.carbs / totalMacroCalories) * 100 : 33;
  const fatPct = totalMacroCalories > 0 ? 100 - proteinPct - carbsPct : 34;

  // SVG donut chart
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const segments = [
    { pct: proteinPct, color: "#ef4444" },
    { pct: carbsPct, color: "#3b82f6" },
    { pct: fatPct, color: "#f59e0b" },
  ];

  let offset = 0;
  const arcs = segments.map((seg) => {
    const dash = (seg.pct / 100) * circumference;
    const gap = circumference - dash;
    const arc = { ...seg, dash, gap, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className="card">
      <div className="section-header">
        <div className="section-header-icon">🥗</div>
        Makronutrientlar
      </div>

      {/* Macro bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.75rem' }}>
        {MACROS.map((macro) => {
          const value = stats.macros[macro.key] || 0;
          const target = macro.targetPct != null
            ? (stats.dailyGoal * macro.targetPct) / macro.calPerG
            : macro.fixedTarget || 25;
          const pct = Math.min((value / target) * 100, 100);
          const isGood = pct >= 60 && pct <= 100;
          const isLow = pct < 40;
          const statusColor = isGood ? macro.color : isLow ? "var(--foreground-subtle)" : "var(--warning)";

          return (
            <div
              key={macro.key}
              style={{
                padding: '0.875rem 1rem',
                background: macro.bg,
                border: `1px solid ${macro.border}`,
                borderRadius: 'var(--radius-sm)',
                transition: 'transform var(--transition)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1rem' }}>{macro.emoji}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: macro.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {macro.label}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: macro.color }}>
                    {Math.round(value)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--foreground-subtle)', marginLeft: '0.125rem' }}>{macro.unit}</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--foreground-subtle)', marginLeft: '0.375rem' }}>
                    / {Math.round(target)}{macro.unit}
                  </span>
                </div>
              </div>
              <div className="progress-bar-wrap" style={{ marginTop: 0, height: '6px' }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${macro.color}aa, ${macro.color})` }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.375rem' }}>
                <span style={{ fontSize: '0.7rem', color: statusColor, fontWeight: 600 }}>
                  {isLow ? '⬇ Kam' : pct > 100 ? '⬆ Ko\'p' : '✓ Normal'}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--foreground-subtle)' }}>{Math.round(pct)}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donut Chart */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          Kaloriya Taqsimoti
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* SVG donut */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width="130" height="130" viewBox="0 0 130 130">
              {/* Background ring */}
              <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
              {/* Segments */}
              {arcs.map((arc, i) => (
                <circle
                  key={i}
                  cx="65"
                  cy="65"
                  r={radius}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="14"
                  strokeDasharray={`${arc.dash} ${arc.gap}`}
                  strokeDashoffset={-arc.offset + circumference * 0.25}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }}
                />
              ))}
              {/* Glow */}
              <circle cx="65" cy="65" r={radius} fill="none" stroke="url(#donutGlow)" strokeWidth="14" opacity="0.3" />
              <defs>
                <linearGradient id="donutGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            {/* Center label */}
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--foreground)', letterSpacing: '-0.04em' }}>
                {Math.round(totalMacroCalories)}
              </div>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                kcal
              </div>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1 }}>
            {[
              { label: 'Protein', color: '#ef4444', pct: proteinPct },
              { label: 'Karbohidrat', color: '#3b82f6', pct: carbsPct },
              { label: "Yog'", color: '#f59e0b', pct: fatPct },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: '0.82rem', color: 'var(--foreground-muted)', flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: item.color }}>{Math.round(item.pct)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
