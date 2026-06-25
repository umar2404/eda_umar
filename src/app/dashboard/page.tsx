import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AddFoodForm from "./AddFoodForm";
import NutritionBreakdown from "./NutritionBreakdown";
import WeightTracker from "./WeightTracker";
import FavoritesManager from "./FavoritesManager";
import ExerciseVideos from "./ExerciseVideos";
import AIAdvisor from "./AIAdvisor";


export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include: {
      foods: {
        where: { date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        orderBy: { date: "desc" },
      },
      exercises: {
        where: { date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      },
    },
  });

  if (!user) redirect("/login");

  const totalCalories = user.foods.reduce((acc, food) => acc + food.calories, 0);
  const burnedCalories = user.exercises.reduce((acc, ex) => acc + ex.caloriesBurned, 0);
  const netCalories = totalCalories - burnedCalories;

  const targetCalories = user.dailyCalorieGoal || 2000;
  const remaining = Math.round(targetCalories - netCalories);
  const isExceeding = netCalories > targetCalories;
  const progressPercent = Math.min((netCalories / targetCalories) * 100, 100);

  const goalLabel =
    user.goal === "LOSE_WEIGHT" ? "Ozish" : user.goal === "GAIN_WEIGHT" ? "Mushak" : "Saqlash";
  const goalIcon =
    user.goal === "LOSE_WEIGHT" ? "🏃" : user.goal === "GAIN_WEIGHT" ? "💪" : "🧘";
  const goalColor =
    user.goal === "LOSE_WEIGHT" ? "var(--destructive)" : user.goal === "GAIN_WEIGHT" ? "var(--success)" : "var(--primary-light)";
  const goalGradient =
    user.goal === "LOSE_WEIGHT" ? "var(--gradient-red)" : user.goal === "GAIN_WEIGHT" ? "var(--gradient-green)" : "var(--gradient)";

  const msInDay = 1000 * 60 * 60 * 24;
  const daysActive = Math.floor((Date.now() - new Date(user.createdAt).getTime()) / msInDay) + 1;


  // Meal breakdown
  const mealGroups = {
    breakfast: user.foods.filter((f) => f.mealType === "breakfast"),
    lunch: user.foods.filter((f) => f.mealType === "lunch"),
    dinner: user.foods.filter((f) => f.mealType === "dinner"),
    snack: user.foods.filter((f) => f.mealType === "snack"),
    other: user.foods.filter((f) => f.mealType === "other"),
  };

  const mealLabels: Record<string, { label: string; icon: string; color: string }> = {
    breakfast: { label: "Nonushta", icon: "🌅", color: "#f59e0b" },
    lunch: { label: "Tushlik", icon: "🍽️", color: "#3b82f6" },
    dinner: { label: "Kechki ovqat", icon: "🌙", color: "#8b5cf6" },
    snack: { label: "Gazak", icon: "🍿", color: "#06b6d4" },
    other: { label: "Boshqa", icon: "🥗", color: "#64748b" },
  };

  return (
    <div>
      {/* ── HERO ── */}
      <div className="page-hero" style={{ paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.375rem' }}>
              <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, margin: 0, background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Salom, {user.name}! 👋
              </h1>
              <div style={{ padding: '0.25rem 0.75rem', background: 'var(--gradient-orange)', color: '#fff', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 12px rgba(249,115,22,0.3)' }}>
                🔥 {daysActive}-kun
              </div>
            </div>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>
              {new Date().toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)' }}>
            <span style={{ fontSize: '1rem' }}>{goalIcon}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: goalColor }}>{goalLabel} rejimi</span>
          </div>
        </div>
      </div>

      {/* ── EXCEEDED WARNING ── */}
      {isExceeding && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🚨</span>
          <div>
            <div style={{ fontWeight: 700, marginBottom: '0.125rem' }}>Kunlik me'yor oshib ketdi!</div>
            <div style={{ fontSize: '0.85rem', opacity: 0.85 }}>
              Belgilangan {Math.round(targetCalories)} kcal dan {Math.round(netCalories - targetCalories)} kcal ko'p oldingiz. Qo'shimcha mashq qiling!
            </div>
          </div>
        </div>
      )}

      {/* ── STAT CARDS ── */}
      <div className="stats-row" style={{ marginBottom: '2rem' }}>
        {/* Consumed */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}>🍽️</div>
          <div className="stat-label">Iste'mol qilingan</div>
          <div className="stat-value">{totalCalories}<span className="stat-unit">kcal</span></div>
          <div className="progress-bar-wrap">
            <div
              className="progress-bar-fill"
              style={{ width: `${progressPercent}%`, background: isExceeding ? 'var(--gradient-red)' : 'var(--gradient)' }}
            />
          </div>
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--foreground-subtle)' }}>
            Maqsad: {Math.round(targetCalories)} kcal ({Math.round(progressPercent)}%)
          </div>
        </div>

        {/* Burned */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.25)' }}>🔥</div>
          <div className="stat-label">Yoqilgan</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{burnedCalories}<span className="stat-unit">kcal</span></div>
          <div style={{ marginTop: '0.875rem', fontSize: '0.8rem', color: 'var(--foreground-subtle)' }}>
            {user.exercises.length} ta mashq bugun
          </div>
        </div>

        {/* Net remaining */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: isExceeding ? 'rgba(244,63,94,0.15)' : 'rgba(6,182,212,0.15)', border: `1px solid ${isExceeding ? 'rgba(244,63,94,0.25)' : 'rgba(6,182,212,0.25)'}` }}>
            {isExceeding ? '⚠️' : '✅'}
          </div>
          <div className="stat-label">Qoldiq / Net</div>
          <div className="stat-value" style={{ color: isExceeding ? 'var(--destructive)' : 'var(--accent)' }}>
            {remaining}<span className="stat-unit">kcal</span>
          </div>
          <div style={{ marginTop: '0.875rem', fontSize: '0.8rem', color: 'var(--foreground-subtle)' }}>
            Net: {netCalories} kcal
          </div>
        </div>

        {/* Foods count */}
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.25)' }}>📊</div>
          <div className="stat-label">Bugungi taomlar</div>
          <div className="stat-value" style={{ color: 'var(--accent2)' }}>{user.foods.length}<span className="stat-unit">ta</span></div>
          <div style={{ marginTop: '0.875rem', fontSize: '0.8rem', color: 'var(--foreground-subtle)' }}>
            {Math.round(totalCalories / (user.foods.length || 1))} kcal o'rtacha
          </div>
        </div>
      </div>

      {/* ── MAIN 3-COLUMN GRID ── */}
      <div className="dashboard-grid">

        {/* LEFT: Add Food + Food Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <AddFoodForm />

          {/* Today's Food Log */}
          <div className="card">
            <div className="section-header">
              <div className="section-header-icon">📋</div>
              Bugungi Ovqatlar
              <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>{user.foods.length} ta</span>
            </div>

            {user.foods.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2.5rem 1rem',
                color: 'var(--foreground-subtle)',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.5 }}>🍽️</div>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Hali ovqat qo'shilmagan</div>
                <div style={{ fontSize: '0.85rem' }}>Chapdan ovqat qo'shing</div>
              </div>
            ) : (
              <div>
                {/* Meal groups */}
                {Object.entries(mealGroups).map(([mealType, foods]) => {
                  if (foods.length === 0) return null;
                  const ml = mealLabels[mealType];
                  const mealCals = foods.reduce((a, f) => a + f.calories, 0);
                  return (
                    <div key={mealType} style={{ marginBottom: '1rem' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                        padding: '0.375rem 0',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.82rem', fontWeight: 700, color: ml.color }}>
                          <span>{ml.icon}</span>
                          <span style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>{ml.label}</span>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--foreground-muted)' }}>{mealCals} kcal</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        {foods.map((food) => (
                          <div key={food.id} className="food-log-item">
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{food.name}</div>
                              {food.protein && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--foreground-subtle)', marginTop: '0.125rem' }}>
                                  P: {food.protein}g · K: {food.carbs || 0}g · Y: {food.fat || 0}g
                                </div>
                              )}
                            </div>
                            <span className="food-calorie-badge" style={{ fontSize: '0.78rem' }}>
                              🔥 {food.calories}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* MIDDLE: Nutrition Breakdown */}
        <div>
          <NutritionBreakdown />
        </div>

        {/* RIGHT: Weight + Favorites */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <WeightTracker />
          <FavoritesManager />
        </div>
      </div>

      {/* ── EXERCISE SECTION ── */}
      <div style={{ marginBottom: '2rem' }}>
        {isExceeding && (
          <div className="alert alert-warning" style={{ marginBottom: '1.25rem' }}>
            <span>🚨</span>
            <span>Bugun ko'p kaloriya oldingiz! Kardio mashqlaridan birini bajarishni tavsiya qilamiz.</span>
          </div>
        )}
        <ExerciseVideos userGoal={user.goal || "MAINTAIN"} />
      </div>

      {/* ── AI ADVISOR ── */}
      <AIAdvisor />
    </div>
  );
}
