"use client";

import { useEffect, useState } from "react";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
}

export default function WeightTracker() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchWeights();
  }, []);

  const fetchWeights = async () => {
    try {
      const res = await fetch("/api/weight?days=30");
      if (res.ok) setWeights(await res.json());
    } catch (err) {
      console.error("Weight fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weight: parseFloat(newWeight) }),
      });
      if (res.ok) {
        setNewWeight("");
        await fetchWeights();
        showToast("✅ Og'irlik qo'shildi!");
      }
    } catch (err) {
      console.error("Weight save error:", err);
      showToast("❌ Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  const currentWeight = weights.length > 0 ? weights[weights.length - 1].weight : null;
  const firstWeight = weights.length > 1 ? weights[0].weight : null;
  const totalChange = currentWeight && firstWeight ? currentWeight - firstWeight : 0;
  const lastChange = weights.length > 1
    ? weights[weights.length - 1].weight - weights[weights.length - 2].weight
    : 0;

  const getAnalysisText = () => {
    if (weights.length < 2) return "Tahlil qilish uchun kamida 2 kunlik ma'lumot kiriting.";
    if (totalChange < 0) {
      if (totalChange <= -2) return `Ajoyib natija! Siz boshlang'ich vazningizdan ${Math.abs(totalChange).toFixed(1)} kg tashladingiz. 🔥 Davom eting!`;
      return `Yaxshi boshlanish! Siz ${Math.abs(totalChange).toFixed(1)} kg vazn tashladingiz. 👏`;
    } else if (totalChange > 0) {
      return `Siz boshlang'ich vazningizdan ${totalChange.toFixed(1)} kg og'irlashdingiz. Dietaga va mashqlarga ko'proq e'tibor bering. 💪`;
    } else {
      return `Vazningiz bir xil darajada saqlanmoqda. Natijani yaxshilash uchun kardioni ko'paytiring. 🏃`;
    }
  };

  // Mini sparkline data
  const sparkMax = weights.length > 0 ? Math.max(...weights.map(w => w.weight)) : 100;
  const sparkMin = weights.length > 0 ? Math.min(...weights.map(w => w.weight)) : 0;
  const sparkRange = sparkMax - sparkMin || 1;
  const sparkPoints = weights.slice(-15).map((w, i, arr) => ({
    x: (i / Math.max(arr.length - 1, 1)) * 200,
    y: 50 - ((w.weight - sparkMin) / sparkRange) * 40,
  }));

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, animation: 'toastIn 0.4s ease' }}>
          <div className="toast toast-success">{toast}</div>
        </div>
      )}

      <div className="card">
        <div className="section-header">
          <div className="section-header-icon">⚖️</div>
          Og'irlik Kuzatuvi
          {weights.length > 0 && (
            <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>30 kun</span>
          )}
        </div>

        {/* Current weight display */}
        {currentWeight && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.08))',
            border: '1px solid var(--border-accent)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem',
            marginBottom: '1.25rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              Joriy og'irlik
            </div>
            <div style={{ fontSize: '2.75rem', fontWeight: 800, background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {currentWeight.toFixed(1)}
              <span style={{ fontSize: '1.1rem', WebkitTextFillColor: 'var(--foreground-muted)', marginLeft: '0.25rem' }}>kg</span>
            </div>

            {/* Changes */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {lastChange !== 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  fontSize: '0.82rem', fontWeight: 700,
                  color: lastChange < 0 ? 'var(--success)' : 'var(--destructive)',
                }}>
                  {lastChange < 0 ? '📉' : '📈'} {lastChange < 0 ? '-' : '+'}{Math.abs(lastChange).toFixed(1)} kg (oxirgi)
                </div>
              )}
              {totalChange !== 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  fontSize: '0.82rem', fontWeight: 700,
                  color: totalChange < 0 ? 'var(--success)' : '#f59e0b',
                }}>
                  {totalChange < 0 ? '🎯' : '📊'} {totalChange < 0 ? '-' : '+'}{Math.abs(totalChange).toFixed(1)} kg (jami)
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '1.25rem', padding: '0.875rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-sm)', border: '1px dashed var(--border)', fontSize: '0.82rem', color: 'var(--foreground-subtle)', lineHeight: 1.5 }}>
              ✨ <b>Tahlil:</b> {getAnalysisText()}
            </div>
          </div>
        )}

        {/* Sparkline */}
        {weights.length > 2 && (
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
              So'nggi dinamika
            </div>
            <div style={{ background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', padding: '0.5rem', border: '1px solid var(--border)' }}>
              <svg width="100%" viewBox="0 0 200 60" style={{ display: 'block' }}>
                {/* Area fill */}
                <defs>
                  <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {sparkPoints.length > 1 && (
                  <>
                    <path
                      d={`M ${sparkPoints.map(p => `${p.x},${p.y}`).join(' L ')} L ${sparkPoints[sparkPoints.length - 1].x},55 L ${sparkPoints[0].x},55 Z`}
                      fill="url(#sparkGrad)"
                    />
                    <polyline
                      points={sparkPoints.map(p => `${p.x},${p.y}`).join(' ')}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Dot at last point */}
                    <circle
                      cx={sparkPoints[sparkPoints.length - 1].x}
                      cy={sparkPoints[sparkPoints.length - 1].y}
                      r="3.5"
                      fill="#06b6d4"
                      stroke="white"
                      strokeWidth="1.5"
                    />
                  </>
                )}
              </svg>
            </div>
          </div>
        )}

        {/* Add weight form */}
        <form onSubmit={handleAddWeight} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.9rem', opacity: 0.5, pointerEvents: 'none' }}>⚖️</span>
            <input
              type="number"
              step="0.1"
              min="20"
              max="300"
              placeholder="Og'irlik (kg)"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="input"
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting || !newWeight} style={{ padding: "0.625rem 1rem", borderRadius: 'var(--radius-sm)', flexShrink: 0 }}>
            {submitting ? (
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
            ) : '➕'}
          </button>
        </form>

        {/* History */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '48px' }} />)}
          </div>
        ) : weights.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--foreground-subtle)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', opacity: 0.4 }}>⚖️</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Og'irlik ma'lumoti yo'q</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>
              So'nggi yozuvlar
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", maxHeight: "200px", overflowY: "auto" }}>
              {[...weights].reverse().slice(0, 10).map((entry, idx) => {
                const sorted = [...weights].reverse();
                const next = sorted[idx + 1];
                const diff = next ? entry.weight - next.weight : 0;
                return (
                  <div
                    key={entry.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.625rem 0.875rem",
                      background: idx === 0 ? "rgba(99,102,241,0.08)" : "var(--bg-glass)",
                      border: `1px solid ${idx === 0 ? 'rgba(99,102,241,0.2)' : 'var(--border)'}`,
                      borderRadius: "var(--radius-xs)",
                      fontSize: "0.875rem",
                      transition: 'background var(--transition)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      {idx === 0 && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }} />}
                      <div>
                        <div style={{ fontWeight: idx === 0 ? 700 : 500, color: idx === 0 ? 'var(--foreground)' : 'var(--foreground-muted)' }}>
                          {entry.weight.toFixed(1)} kg
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--foreground-subtle)" }}>
                          {new Date(entry.date).toLocaleDateString("uz-UZ", { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    {diff !== 0 && (
                      <div style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        color: diff < 0 ? "var(--success)" : "var(--destructive)",
                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                      }}>
                        {diff < 0 ? "📉" : "📈"} {Math.abs(diff).toFixed(1)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
