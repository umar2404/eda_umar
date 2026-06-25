"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const GOALS = [
  {
    value: "LOSE_WEIGHT",
    icon: "🏃",
    label: "Ozish",
    desc: "Kaloriya kamaytirib, yog'ni yoqish",
    color: "rgba(244,63,94,0.2)",
    border: "rgba(244,63,94,0.4)",
  },
  {
    value: "MAINTAIN",
    icon: "🧘",
    label: "Saqlash",
    desc: "Hozirgi vaznni saqlab turish",
    color: "rgba(99,102,241,0.2)",
    border: "rgba(99,102,241,0.4)",
  },
  {
    value: "GAIN_WEIGHT",
    icon: "💪",
    label: "Mushak",
    desc: "Mushak massasini oshirish",
    color: "rgba(16,185,129,0.2)",
    border: "rgba(16,185,129,0.4)",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    weight: "",
    height: "",
    goal: "LOSE_WEIGHT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.message || "Ro'yxatdan o'tishda xatolik");
      setLoading(false);
    }
  };

  const canNextStep1 = form.name.trim() && form.email.trim() && form.password.length >= 6;

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon" style={{ background: 'var(--gradient-purple)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="12" cy="7" r="4" stroke="white" strokeWidth="2.5"/>
            </svg>
          </div>
          <h1 className="auth-title">Hisob yaratish</h1>
          <p className="auth-subtitle">FitLife bilan sog'lom hayotga qadam qo'ying</p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: s <= step ? 'var(--gradient)' : 'var(--bg-glass)',
                border: `2px solid ${s <= step ? 'transparent' : 'var(--border)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: s <= step ? '#fff' : 'var(--foreground-subtle)',
                transition: 'all var(--transition)',
                boxShadow: s <= step ? 'var(--shadow-glow-primary)' : 'none',
              }}>
                {s < step ? '✓' : s}
              </div>
              {s < 2 && (
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: step > s ? 'var(--gradient)' : 'var(--border)',
                  borderRadius: '1px',
                  transition: 'all var(--transition)',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* ──── STEP 1 ──── */}
          {step === 1 && (
            <>
              <div>
                <label className="field-label">To'liq ismingiz</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>👤</span>
                  <input
                    className="input"
                    type="text"
                    placeholder="Ism Familiya"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Email manzil</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>✉️</span>
                  <input
                    className="input"
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="field-label">Parol (kamida 6 ta belgi)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>🔒</span>
                  <input
                    className="input"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    minLength={6}
                    style={{ paddingLeft: '2.5rem', paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, fontSize: '0.9rem',
                      color: 'var(--foreground-muted)',
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                disabled={!canNextStep1}
                onClick={() => setStep(2)}
                style={{ padding: '0.875rem', fontSize: '0.95rem', marginTop: '0.25rem', borderRadius: 'var(--radius-sm)' }}
              >
                Davom etish →
              </button>
            </>
          )}

          {/* ──── STEP 2 ──── */}
          {step === 2 && (
            <>
              {/* Physical stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="field-label">Vazn (kg)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>⚖️</span>
                    <input
                      className="input"
                      type="number"
                      placeholder="70"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="field-label">Bo'y (cm)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>📏</span>
                    <input
                      className="input"
                      type="number"
                      placeholder="175"
                      value={form.height}
                      onChange={(e) => setForm({ ...form, height: e.target.value })}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Goal selector */}
              <div>
                <label className="field-label" style={{ marginBottom: '0.75rem' }}>Maqsadingiz</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {GOALS.map((goal) => (
                    <div
                      key={goal.value}
                      onClick={() => setForm({ ...form, goal: goal.value })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.875rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: `1.5px solid ${form.goal === goal.value ? goal.border : 'var(--border)'}`,
                        background: form.goal === goal.value ? goal.color : 'var(--bg-glass)',
                        cursor: 'pointer',
                        transition: 'all var(--transition)',
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-xs)',
                        background: goal.color,
                        border: `1px solid ${goal.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        flexShrink: 0,
                      }}>
                        {goal.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--foreground)' }}>{goal.label}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>{goal.desc}</div>
                      </div>
                      <div style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: `2px solid ${form.goal === goal.value ? goal.border : 'var(--border)'}`,
                        background: form.goal === goal.value ? goal.color : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all var(--transition)',
                        flexShrink: 0,
                      }}>
                        {form.goal === goal.value && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-light)' }} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '0.875rem', borderRadius: 'var(--radius-sm)' }}
                >
                  ← Orqaga
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ flex: 2, padding: '0.875rem', fontSize: '0.95rem', borderRadius: 'var(--radius-sm)' }}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                      </svg>
                      Yaratilmoqda...
                    </>
                  ) : (
                    '🎉 Hisob yaratish'
                  )}
                </button>
              </div>
            </>
          )}
        </form>

        {/* Login link */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
            Hisobingiz bormi?{' '}
            <a href="/login" style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
              Tizimga kiring →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
