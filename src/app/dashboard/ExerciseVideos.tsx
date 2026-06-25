"use client";

import { useState } from "react";

const safeIds = [
  "2pLT-olgUJs", "1f8yoFFdkcY", "VWj8ZxCxrYk", 
  "8DZktowZo_k", "Eml2xnoLpYE", "L_xrDAtykMI"
];

const generateVideos = (categoryName: string, offset: number) => {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `${categoryName.toLowerCase()}-${i + 1}`,
    title: `${categoryName} bo'yicha ${i + 1}-darslik`,
    youtubeId: safeIds[(i + offset) % safeIds.length],
    duration: `${10 + (i * 2)} daqiqa`,
    part: `Qism ${i + 1}`
  }));
};

const VIDEO_CATEGORIES = [
  {
    id: "LOSE_WEIGHT",
    title: "🔥 Tez Ozish (Kardio & HIIT)",
    desc: "Butun tana yog'larini yoqish uchun eng samarali kardio mashqlari",
    videos: generateVideos("Tez Ozish", 0)
  },
  {
    id: "BELLY_FAT",
    title: "🎯 Qorin Yo'qotish (Press)",
    desc: "Qorin sohasidagi yog'larni yo'qotish va press chiqarish uchun",
    videos: generateVideos("Qorin", 1)
  },
  {
    id: "BUILD_MUSCLE",
    title: "💪 Mushak Massasini Oshirish",
    desc: "Tana shaklini chiroyli qilish va mushak o'stirish",
    videos: generateVideos("Mushak Massasi", 2)
  },
  {
    id: "MAINTAIN",
    title: "🏃‍♀️ Vaznni Saqlash & Tonus",
    desc: "Sog'lom qomatni saqlab qolish uchun kundalik faollik",
    videos: generateVideos("Vaznni Saqlash", 3)
  },
  {
    id: "HOME_WORKOUT",
    title: "🏠 Uy Sharoitida (Uskunalarsiz)",
    desc: "Hech qanday sport anjomlarisiz bajariladigan mashqlar",
    videos: generateVideos("Uy Sharoitida", 4)
  },
  {
    id: "BEGINNER",
    title: "🌱 Boshlang'ichlar Uchun",
    desc: "Sportni endi boshlaganlar uchun oson va xavfsiz mashqlar",
    videos: generateVideos("Boshlang'ich", 5)
  }
];

export default function ExerciseVideos({ userGoal }: { userGoal: string }) {
  const [activeCategory, setActiveCategory] = useState<string>(
    userGoal === "GAIN_WEIGHT" ? "BUILD_MUSCLE" : userGoal === "MAINTAIN" ? "MAINTAIN" : "LOSE_WEIGHT"
  );

  const activeVideos = VIDEO_CATEGORIES.find(c => c.id === activeCategory)?.videos || [];

  return (
    <div className="card" style={{ padding: "0" }}>
      {/* Header */}
      <div style={{ padding: "1.5rem 1.5rem 0", marginBottom: "1rem" }}>
        <div className="section-header" style={{ marginBottom: "0.5rem" }}>
          <div className="section-header-icon" style={{ background: "var(--gradient-purple)" }}>🎬</div>
          Premium Fitnes Dasturi
        </div>
        <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>
          Maqsadingiz va darajangizga mos videodarsliklar to'plami. Uydan chiqmasdan shug'ullaning!
        </p>
      </div>

      {/* Categories Tabs (Netflix style horizontal scroll) */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        overflowX: "auto",
        padding: "0 1.5rem 1rem",
        scrollbarWidth: "none",
        borderBottom: "1px solid var(--border)"
      }}>
        {VIDEO_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.85rem",
              fontWeight: 600,
              whiteSpace: "nowrap",
              border: `1.5px solid ${activeCategory === cat.id ? "var(--primary-light)" : "var(--border)"}`,
              background: activeCategory === cat.id ? "rgba(99,102,241,0.15)" : "var(--bg-glass)",
              color: activeCategory === cat.id ? "var(--primary-light)" : "var(--foreground-muted)",
              cursor: "pointer",
              transition: "all var(--transition)",
            }}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* Active Category Description */}
      <div style={{ padding: "1.25rem 1.5rem 0" }}>
        <div style={{ display: "inline-block", padding: "0.3rem 0.75rem", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", color: "var(--foreground-subtle)", marginBottom: "1.25rem", border: "1px solid var(--border)" }}>
          {VIDEO_CATEGORIES.find(c => c.id === activeCategory)?.desc}
        </div>
      </div>

      {/* Videos Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
        gap: "1.25rem",
        padding: "0 1.5rem 1.5rem",
      }}>
        {activeVideos.map((video, idx) => (
          <div key={idx} className="video-card" style={{ background: "var(--bg-glass-strong)" }}>
            <div style={{ position: "relative" }}>
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId || video.id}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ width: "100%", aspectRatio: "16/9", border: "none", display: "block" }}
              />
              <div style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.5rem",
                background: "rgba(0,0,0,0.7)",
                color: "#fff",
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.7rem",
                fontWeight: 600,
                backdropFilter: "blur(4px)"
              }}>
                Qism {idx + 1}
              </div>
            </div>
            <div className="video-card-label" style={{ padding: "1rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "var(--gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.7rem",
                color: "#fff",
                fontWeight: 700,
                flexShrink: 0
              }}>
                {idx + 1}
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)", lineHeight: 1.4 }}>
                {video.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
