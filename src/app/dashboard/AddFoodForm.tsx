"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type ToastType = "success" | "error" | null;

export default function AddFoodForm() {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [mealType, setMealType] = useState("other");
  const [addToFavorites, setAddToFavorites] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{ name: string; calories: number } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType }>({ message: "", type: null });
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: null }), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !calories) {
      showToast("Ovqat nomi va kaloriya kiritish kerak", "error");
      return;
    }

    setSubmitting(true);
    const body = {
      name,
      calories: parseInt(calories),
      ...(protein && { protein: parseFloat(protein) }),
      ...(carbs && { carbs: parseFloat(carbs) }),
      ...(fat && { fat: parseFloat(fat) }),
      ...(fiber && { fiber: parseFloat(fiber) }),
      mealType,
    };

    try {
      const res = await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Food save failed");

      if (addToFavorites) {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      // Reset
      setName(""); setCalories(""); setProtein(""); setCarbs("");
      setFat(""); setFiber(""); setMealType("other");
      setAddToFavorites(false); setPreviewUrl(null); setAiResult(null);
      showToast(`✅ "${body.name}" muvaffaqiyatli qo'shildi!`, "success");
      router.refresh();
    } catch (err) {
      console.error("Add food error:", err);
      showToast("Ovqat qo'shishda xatolik yuz berdi", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewUrl(URL.createObjectURL(file));
    setAiResult(null);
    setLoadingAI(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(",")[1];
        const res = await fetch("/api/analyze-food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64String }),
        });

        if (res.ok) {
          const data = await res.json();
          setName(data.name);
          setCalories(data.calories.toString());
          setAiResult({ name: data.name, calories: data.calories });
          showToast(`🤖 AI aniqladi: ${data.name} (${data.calories} kcal)`, "success");
        } else {
          showToast("AI tahlil qilolmadi. Qo'lda kiriting.", "error");
        }
        setLoadingAI(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setLoadingAI(false);
      showToast("Rasm yuklashda xatolik", "error");
    }
  };

  const handleTextAnalysis = async () => {
    if (!name.trim()) {
      showToast("Tahlil uchun ovqat nomini yozing", "error");
      return;
    }
    setLoadingAI(true);
    try {
      const res = await fetch("/api/analyze-food-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: name }),
      });
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setCalories(data.calories.toString());
        if (data.protein) setProtein(data.protein.toString());
        if (data.carbs) setCarbs(data.carbs.toString());
        if (data.fat) setFat(data.fat.toString());
        if (data.fiber) setFiber(data.fiber.toString());
        showToast(`✨ AI hisobladi: ${data.calories} kcal`, "success");
      } else {
        showToast("AI tahlil qilolmadi.", "error");
      }
    } catch (err) {
      showToast("Tahlilda xatolik", "error");
    } finally {
      setLoadingAI(false);
    }
  };

  const mealOptions = [
    { value: "breakfast", label: "🌅 Nonushta", color: "#f59e0b" },
    { value: "lunch", label: "🍽️ Tushlik", color: "#3b82f6" },
    { value: "dinner", label: "🌙 Kechki ovqat", color: "#8b5cf6" },
    { value: "snack", label: "🍿 Gazak", color: "#06b6d4" },
    { value: "other", label: "🥗 Boshqa", color: "#64748b" },
  ];

  const isLoading = loadingAI || submitting;

  return (
    <>
      {/* Toast */}
      {toast.type && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          animation: 'toastIn 0.4s var(--ease-bounce)',
        }}>
          <div className={`toast toast-${toast.type === "success" ? "success" : "error"}`}>
            <span style={{ fontSize: '1.1rem' }}>{toast.type === "success" ? "✅" : "❌"}</span>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className="card">
        {/* Header */}
        <div className="section-header">
          <div className="section-header-icon">🍽️</div>
          Ovqat Qo'shish
        </div>

        {/* AI Upload Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.06))',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-sm)',
          padding: '1rem',
          marginBottom: '1.25rem',
        }}>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />

          {/* Image Preview */}
          {previewUrl && (
            <div className="food-image-card" style={{ marginBottom: '1rem' }}>
              <img src={previewUrl} alt="Ovqat rasmi" />
              <div className="food-image-info">
                {loadingAI ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 11-6.219-8.56" />
                    </svg>
                    AI tahlil qilmoqda...
                  </div>
                ) : aiResult ? (
                  <>
                    <span className="food-image-name">{aiResult.name}</span>
                    <span className="food-calorie-badge">🔥 {aiResult.calories} kcal</span>
                  </>
                ) : null}
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            style={{ width: "100%", padding: "0.8rem", fontSize: "0.9rem" }}
          >
            {loadingAI ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                AI tahlil qilmoqda...
              </>
            ) : (
              <>📸 AI bilan ovqatni tahlil qilish</>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.625rem', fontSize: '0.75rem', color: 'var(--foreground-subtle)' }}>
            Yoki qo'lda to'ldiring ↓
          </div>
        </div>

        {/* Manual Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          {/* Name + Calories */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr min(30%, 130px)", gap: "0.75rem", alignItems: "flex-end" }}>
            <div>
              <label className="field-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                Ovqat nomi *
                <button 
                  type="button" 
                  onClick={handleTextAnalysis}
                  disabled={loadingAI || !name.trim()}
                  style={{ 
                    background: 'none', border: 'none', color: 'var(--primary-light)', 
                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' 
                  }}
                  title="Yozilgan nom bo'yicha AI da hisoblash"
                >
                  ✨ AI hisoblash
                </button>
              </label>
              <input
                className="input"
                type="text"
                placeholder="Masalan: Osh, Pizza..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loadingAI}
              />
            </div>
            <div>
              <label className="field-label">Kaloriya *</label>
              <input
                className="input"
                type="number"
                placeholder="500"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                required
                disabled={loadingAI}
              />
            </div>
          </div>

          {/* Meal Type Tabs */}
          <div>
            <label className="field-label">Ovqat turi</label>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {mealOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMealType(opt.value)}
                  disabled={loadingAI}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: `1.5px solid ${mealType === opt.value ? opt.color : 'var(--border)'}`,
                    background: mealType === opt.value ? `${opt.color}22` : 'var(--bg-glass)',
                    color: mealType === opt.value ? opt.color : 'var(--foreground-subtle)',
                    cursor: 'pointer',
                    transition: 'all var(--transition)',
                    fontFamily: 'var(--font)',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Macros */}
          <div style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border)',
            padding: '1rem',
            borderRadius: 'var(--radius-sm)',
          }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--foreground-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
              📊 Makronutrientlar (ixtiyoriy)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.625rem" }}>
              {[
                { label: "Protein (g)", placeholder: "25", value: protein, setter: setProtein, color: "#ef4444" },
                { label: "Karbohidrat (g)", placeholder: "50", value: carbs, setter: setCarbs, color: "#3b82f6" },
                { label: "Yog' (g)", placeholder: "10", value: fat, setter: setFat, color: "#f59e0b" },
                { label: "Tola (g)", placeholder: "5", value: fiber, setter: setFiber, color: "#10b981" },
              ].map((field) => (
                <div key={field.label}>
                  <label style={{
                    display: 'block',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: field.color,
                    marginBottom: '0.3rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    opacity: 0.85,
                  }}>{field.label}</label>
                  <input
                    className="input"
                    type="number"
                    step="0.1"
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    disabled={loadingAI}
                    style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Favorites */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            cursor: 'pointer',
            padding: '0.75rem 1rem',
            background: addToFavorites ? 'rgba(245,158,11,0.08)' : 'var(--bg-glass)',
            border: `1px solid ${addToFavorites ? 'rgba(245,158,11,0.3)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)',
            transition: 'all var(--transition)',
          }}>
            <input
              type="checkbox"
              checked={addToFavorites}
              onChange={(e) => setAddToFavorites(e.target.checked)}
              disabled={loadingAI}
              style={{ accentColor: '#f59e0b', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.9rem', color: addToFavorites ? '#fbbf24' : 'var(--foreground-muted)', fontWeight: 600 }}>
              ⭐ Sevimli ovqatlarga qo'shish
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || !name || !calories}
            style={{ width: "100%", padding: "0.875rem", fontSize: "0.95rem", borderRadius: 'var(--radius-sm)' }}
          >
            {submitting ? (
              <>
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-6.219-8.56" />
                </svg>
                Qo'shilmoqda...
              </>
            ) : (
              "✚ Ovqat Qo'shish"
            )}
          </button>
        </form>
      </div>
    </>
  );
}
