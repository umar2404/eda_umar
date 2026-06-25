"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email yoki parol noto'g'ri. Qayta urinib ko'ring.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.15)"/>
              <path d="M8 12.5L10.5 15L16 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3.5" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <h1 className="auth-title">Xush kelibsiz!</h1>
          <p className="auth-subtitle">FitLife hisobingizga kiring va davom eting</p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: '1.5rem', animation: 'slideDown 0.3s ease' }}>
            <span style={{ fontSize: '1.1rem' }}>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="field-label">Email manzil</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                fontSize: '1rem', pointerEvents: 'none', opacity: 0.5,
              }}>✉️</span>
              <input
                className="input"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div>
            <label className="field-label">Parol</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                fontSize: '1rem', pointerEvents: 'none', opacity: 0.5,
              }}>🔒</span>
              <input
                className="input"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '0.875rem', fontSize: '0.95rem', marginTop: '0.5rem', borderRadius: 'var(--radius-sm)' }}
          >
            {loading ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
                Kirish...
              </>
            ) : (
              'Kirish →'
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0' }}>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--foreground-subtle)', fontWeight: 600 }}>YOKI</span>
          <div className="divider" style={{ flex: 1, margin: 0 }} />
        </div>

        {/* Register link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
            Hisobingiz yo&apos;qmi?{' '}
            <a
              href="/register"
              style={{
                color: 'var(--primary-light)',
                fontWeight: 700,
                transition: 'opacity var(--transition)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Ro&apos;yxatdan o&apos;ting →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
