export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="home-hero">
        {/* Tag */}
        <div className="home-hero-tag">
          <span>✨</span>
          <span>AI Yordamida Sog'liq Platformasi</span>
        </div>

        {/* Title */}
        <h1 className="home-hero-title">
          Ovqatingizni <span className="gradient-text">Aqlli</span> Kuzating,<br />
          Sog'lom <span className="gradient-text">Yashang</span>
        </h1>

        {/* Description */}
        <p className="home-hero-desc">
          FitLife — AI orqali ovqatingizni tahlil qiling, kaloriyangizni hisoblang,
          shaxsiy mashq tavsiyalari oling va sog'lom hayotga yangi qadam qo'ying.
        </p>

        {/* Actions */}
        <div className="home-hero-actions">
          <a href="/register" className="btn btn-primary btn-hero">
            🚀 Bepul Boshlash
          </a>
          <a href="/login" className="btn btn-ghost btn-hero">
            Tizimga Kirish →
          </a>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex',
          gap: '2.5rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '4rem',
          animation: 'fadeInSlide 1s ease',
        }}>
          {[
            { value: '10,000+', label: 'Foydalanuvchi' },
            { value: '2M+', label: 'Hisoblangan Kaloriya' },
            { value: '98%', label: 'AI Aniqligi' },
            { value: '50+', label: 'Mashq Tavsiyasi' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                background: 'var(--gradient-text)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.03em',
              }}>{stat.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--foreground-subtle)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="features-grid">
          {[
            {
              icon: '📸',
              gradient: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))',
              border: 'rgba(99,102,241,0.3)',
              title: 'AI Rasm Tahlili',
              desc: 'Ovqat rasmini yuklang — sunʼiy intellekt bir zumda kaloriya, protein va makrolarni aniqlaydi',
              tag: 'Gemini AI',
              tagColor: '#818cf8',
            },
            {
              icon: '🏋️',
              gradient: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))',
              border: 'rgba(6,182,212,0.3)',
              title: 'Shaxsiy Mashqlar',
              desc: 'Maqsadingizga mos YouTube mashq videolari va professional mashq tavsiyalari',
              tag: 'Personalized',
              tagColor: '#22d3ee',
            },
            {
              icon: '📊',
              gradient: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(168,85,247,0.05))',
              border: 'rgba(168,85,247,0.3)',
              title: 'Makro Kuzatuvi',
              desc: 'Protein, karbohidrat, yog\' va tolani real vaqtda kuzating. Maqsadlaringizga yeting',
              tag: 'Real-time',
              tagColor: '#c084fc',
            },
            {
              icon: '⚖️',
              gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
              border: 'rgba(16,185,129,0.3)',
              title: 'Og\'irlik Tarixi',
              desc: '30 kunlik og\'irlik o\'zgarishlarini kuzating va maqsadingizga sari yurish sur\'atini ko\'ring',
              tag: '30-kun',
              tagColor: '#34d399',
            },
            {
              icon: '⭐',
              gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))',
              border: 'rgba(245,158,11,0.3)',
              title: 'Sevimli Ovqatlar',
              desc: 'Tez-tez yeydigan ovqatlarni saqlang va bitta tugma bilan bugungi ro\'yxatga qo\'shing',
              tag: 'Aqlli',
              tagColor: '#fbbf24',
            },
            {
              icon: '🔔',
              gradient: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(244,63,94,0.05))',
              border: 'rgba(244,63,94,0.3)',
              title: 'Aqlli Ogohlantirishlar',
              desc: 'Kunlik me\'yordan oshsangiz, tizim darhol ogohlantiradi va qo\'shimcha mashq tavsiya qiladi',
              tag: 'Smart Alert',
              tagColor: '#fb7185',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="feature-card"
              style={{ borderColor: feature.border }}
            >
              <div
                className="feature-icon"
                style={{ background: feature.gradient, border: `1px solid ${feature.border}` }}
              >
                {feature.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <h3 className="feature-title" style={{ marginBottom: 0 }}>{feature.title}</h3>
                <span className="badge" style={{ background: 'transparent', color: feature.tagColor, border: `1px solid ${feature.border}`, fontSize: '0.68rem' }}>
                  {feature.tag}
                </span>
              </div>
              <p className="feature-desc">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '4rem 0', textAlign: 'center' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <span className="badge badge-primary">Qanday ishlaydi?</span>
        </div>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          marginBottom: '3rem',
          color: 'var(--foreground)',
        }}>
          3 oddiy qadam bilan boshlang
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          maxWidth: '900px',
          margin: '0 auto',
        }}>
          {[
            { step: '01', icon: '📝', title: "Ro'yxatdan o'ting", desc: 'Ismingiz, maqsadingiz va asosiy ma\'lumotlaringizni kiriting' },
            { step: '02', icon: '📸', title: 'Ovqatni kuzating', desc: 'Rasm yuklang yoki qo\'lda kiriting — AI qolganini qiladi' },
            { step: '03', icon: '🎯', title: 'Maqsadga yeting', desc: 'Shaxsiy tavsiyalar bilan sog\'lom hayotga qadam qo\'ying' },
          ].map((item) => (
            <div key={item.step} style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--primary-light)',
                letterSpacing: '0.15em',
                marginBottom: '1rem',
                opacity: 0.7,
              }}>{item.step}</div>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.875rem' }}>{item.icon}</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--foreground)', fontSize: '1.05rem' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '2rem 0 3rem' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-glow-primary)',
        }}>
          <div style={{
            position: 'absolute',
            top: '-60px',
            left: '-60px',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-60px',
            right: '-60px',
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: 800,
              background: 'var(--gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              marginBottom: '0.75rem',
            }}>
              Bugun boshlang, bepul!
            </h2>
            <p style={{ color: 'var(--foreground-muted)', marginBottom: '1.75rem', fontSize: '1rem' }}>
              Mingtadan ortiq foydalanuvchi allaqachon sog'lom hayot yo'lida
            </p>
            <a href="/register" className="btn btn-primary btn-hero">
              🚀 Hoziroq Boshlash — Bepul
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
