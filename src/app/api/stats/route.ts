import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date") || new Date().toISOString().split("T")[0];
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" },
      select: { id: true, dailyCalorieGoal: true, weight: true, height: true }
    });

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Food entries for the day
    const foods = await prisma.foodEntry.findMany({
      where: {
        userId: user.id,
        date: { gte: startOfDay, lte: endOfDay }
      }
    });

    // Exercise entries for the day
    const exercises = await prisma.exerciseEntry.findMany({
      where: {
        userId: user.id,
        date: { gte: startOfDay, lte: endOfDay }
      }
    });

    // Calculate totals
    const totalCaloriesConsumed = foods.reduce((sum, f) => sum + f.calories, 0);
    const totalCaloriesBurned = exercises.reduce((sum, e) => sum + e.caloriesBurned, 0);
    const netCalories = totalCaloriesConsumed - totalCaloriesBurned;

    const totalProtein = foods.reduce((sum, f) => sum + (f.protein || 0), 0);
    const totalCarbs = foods.reduce((sum, f) => sum + (f.carbs || 0), 0);
    const totalFat = foods.reduce((sum, f) => sum + (f.fat || 0), 0);
    const totalFiber = foods.reduce((sum, f) => sum + (f.fiber || 0), 0);

    const calorieProgress = (totalCaloriesConsumed / user.dailyCalorieGoal) * 100;
    const calorieRemaining = Math.max(0, user.dailyCalorieGoal - totalCaloriesConsumed);

    return NextResponse.json({
      date,
      dailyGoal: user.dailyCalorieGoal,
      consumed: totalCaloriesConsumed,
      burned: totalCaloriesBurned,
      net: netCalories,
      remaining: calorieRemaining,
      progress: Math.round(calorieProgress),
      macros: {
        protein: Math.round(totalProtein * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10,
        fat: Math.round(totalFat * 10) / 10,
        fiber: Math.round(totalFiber * 10) / 10
      },
      foodCount: foods.length,
      exerciseCount: exercises.length,
      userWeight: user.weight,
      userHeight: user.height
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ error: "Statistikani olishda xatolik" }, { status: 500 });
  }
}
