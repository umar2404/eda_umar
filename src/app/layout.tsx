import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FitLife — AI Kaloriya & Mashq Platformasi",
  description: "AI yordamida ovqat tahlil qiling, kaloriyangizni hisoblang va shaxsiy mashq tavsiyalari oling.",
  keywords: ["kaloriya", "sog'lom hayot", "mashq", "AI", "fitnes"],
  openGraph: {
    title: "FitLife — AI Kaloriya & Mashq Platformasi",
    description: "AI yordamida ovqat tahlil qiling va sog'lom yashang.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Ambient background blobs */}
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute',
            top: '-20%',
            left: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 8s ease infinite',
          }} />
          <div style={{
            position: 'absolute',
            top: '30%',
            right: '-15%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 10s ease infinite reverse',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-10%',
            left: '30%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'float 12s ease infinite',
          }} />
        </div>

        <nav className="navbar">
          <div className="navbar-inner">
            {/* Brand */}
            <a href="/" className="navbar-brand">
              <div className="navbar-brand-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="rgba(255,255,255,0.2)"/>
                  <path d="M8 12.5L10.5 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" fill="white" opacity="0.9"/>
                </svg>
              </div>
              FitLife
            </a>

            {/* Nav Actions */}
            <div className="navbar-actions">
              <a href="/login" className="btn btn-ghost" style={{ fontSize: '0.875rem' }}>
                Kirish
              </a>
              <a href="/register" className="btn btn-primary" style={{ fontSize: '0.875rem' }}>
                Boshlash →
              </a>
            </div>
          </div>
        </nav>

        <main className="container" style={{ paddingTop: '1.5rem', paddingBottom: '4rem' }}>
          {children}
        </main>

        {/* Bottom gradient line decoration */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.3), rgba(6,182,212,0.3), transparent)',
          pointerEvents: 'none',
          zIndex: 50,
        }} />
      </body>
    </html>
  );
}
