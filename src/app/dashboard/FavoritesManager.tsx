"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Favorite {
  id: string;
  name: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealType: string;
}

const MEAL_FILTERS = [
  { value: "all", label: "Barchasi", icon: "🍱" },
  { value: "breakfast", label: "Nonushta", icon: "🌅" },
  { value: "lunch", label: "Tushlik", icon: "🍽️" },
  { value: "dinner", label: "Kechki", icon: "🌙" },
  { value: "snack", label: "Gazak", icon: "🍿" },
];

export default function FavoritesManager() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealType, setSelectedMealType] = useState("all");
  const [addingId, setAddingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, [selectedMealType]);

  const fetchFavorites = async () => {
    try {
      const query = selectedMealType === "all" ? "" : `?mealType=${selectedMealType}`;
      const res = await fetch(`/api/favorites${query}`);
      if (res.ok) setFavorites(await res.json());
    } catch (err) {
      console.error("Favorites fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, ok: boolean) => {
    setToast({ message, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToToday = async (fav: Favorite) => {
    setAddingId(fav.id);
    try {
      await fetch("/api/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fav.name,
          calories: fav.calories,
          protein: fav.protein,
          carbs: fav.carbs,
          fat: fav.fat,
          mealType: fav.mealType,
        }),
      });
      showToast(`✅ ${fav.name} bugungi ro'yxatga qo'shildi!`, true);
      router.refresh();
    } catch {
      showToast("❌ Qo'shishda xatolik", false);
    } finally {
      setAddingId(null);
    }
  };

  const handleDelete = async (fav: Favorite) => {
    setDeletingId(fav.id);
    try {
      await fetch(`/api/favorites?name=${encodeURIComponent(fav.name)}`, { method: "DELETE" });
      await fetchFavorites();
      showToast(`🗑️ ${fav.name} o'chirildi`, true);
    } catch {
      showToast("❌ O'chirishda xatolik", false);
    } finally {
      setDeletingId(null);
    }
  };

  const mealColors: Record<string, string> = {
    breakfast: "#f59e0b",
    lunch: "#3b82f6",
    dinner: "#8b5cf6",
    snack: "#06b6d4",
    other: "#64748b",
  };

  const mealIcons: Record<string, string> = {
    breakfast: "🌅",
    lunch: "🍽️",
    dinner: "🌙",
    snack: "🍿",
    other: "🥗",
  };

  return (
    <>
      {toast && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, animation: 'toastIn 0.4s ease' }}>
          <div className={`toast ${toast.ok ? 'toast-success' : 'toast-error'}`}>{toast.message}</div>
        </div>
      )}

      <div className="card">
        <div className="section-header">
          <div className="section-header-icon">⭐</div>
          Sevimli Ovqatlar
          <span className="badge badge-warning" style={{ marginLeft: 'auto' }}>{favorites.length}</span>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {MEAL_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setSelectedMealType(f.value)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: `1.5px solid ${selectedMealType === f.value ? 'var(--primary-light)' : 'var(--border)'}`,
                background: selectedMealType === f.value ? 'rgba(99,102,241,0.15)' : 'var(--bg-glass)',
                color: selectedMealType === f.value ? 'var(--primary-light)' : 'var(--foreground-subtle)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                fontFamily: 'var(--font)',
              }}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Favorites list */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '60px' }} />)}
          </div>
        ) : favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--foreground-subtle)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.625rem', opacity: 0.4 }}>⭐</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              {selectedMealType === 'all' ? 'Hali sevimli ovqat yo\'q' : 'Bu turdagi ovqat yo\'q'}
            </div>
            <div style={{ fontSize: '0.8rem' }}>Ovqat qo'shishda "Sevimli" checkbox ni belgilang</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "300px", overflowY: "auto" }}>
            {favorites.map((fav) => {
              const color = mealColors[fav.mealType] || "#64748b";
              const icon = mealIcons[fav.mealType] || "🥗";
              const isAdding = addingId === fav.id;
              const isDeleting = deletingId === fav.id;

              return (
                <div
                  key={fav.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 0.875rem",
                    background: "var(--bg-glass)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    transition: 'all var(--transition)',
                    opacity: isDeleting ? 0.5 : 1,
                  }}
                >
                  {/* Meal icon */}
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: 'var(--radius-xs)',
                    background: `${color}22`,
                    border: `1px solid ${color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}>
                    {icon}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--foreground)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fav.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--foreground-subtle)', marginTop: '0.1rem' }}>
                      🔥 {fav.calories} kcal
                      {fav.protein ? ` · P:${fav.protein}g` : ''}
                      {fav.carbs ? ` · K:${fav.carbs}g` : ''}
                      {fav.fat ? ` · Y:${fav.fat}g` : ''}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
                    <button
                      onClick={() => handleAddToToday(fav)}
                      disabled={isAdding || isDeleting}
                      className="btn btn-success"
                      style={{ padding: "0.4rem 0.625rem", fontSize: "0.78rem", borderRadius: 'var(--radius-xs)' }}
                      title="Bugungi ro'yxatga qo'shish"
                    >
                      {isAdding ? (
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                      ) : '➕'}
                    </button>
                    <button
                      onClick={() => handleDelete(fav)}
                      disabled={isAdding || isDeleting}
                      className="btn btn-danger"
                      style={{ padding: "0.4rem 0.625rem", fontSize: "0.78rem", borderRadius: 'var(--radius-xs)' }}
                      title="O'chirish"
                    >
                      {isDeleting ? (
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 12a9 9 0 11-6.219-8.56"/>
                        </svg>
                      ) : '🗑️'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
