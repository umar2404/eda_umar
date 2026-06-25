import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user?.email as string } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const url = new URL(req.url);
  const days = parseInt(url.searchParams.get("days") || "7");
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const exercises = await prisma.exerciseEntry.findMany({
    where: {
      userId: user.id,
      date: { gte: startDate }
    },
    orderBy: { date: "desc" }
  });

  return NextResponse.json(exercises);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user?.email as string } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { name, category, durationMin, caloriesBurned, intensity } = await req.json();

  if (!name || !durationMin || !caloriesBurned) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const exercise = await prisma.exerciseEntry.create({
    data: {
      userId: user.id,
      name,
      category: category || "cardio",
      durationMin: parseInt(durationMin),
      caloriesBurned: parseInt(caloriesBurned),
      intensity: intensity || "moderate"
    }
  });

  return NextResponse.json(exercise, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user?.email as string } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const url = new URL(req.url);
  const exerciseId = url.searchParams.get("id");

  if (!exerciseId) {
    return NextResponse.json({ error: "Exercise ID required" }, { status: 400 });
  }

  const exercise = await prisma.exerciseEntry.findUnique({ where: { id: exerciseId } });
  if (!exercise || exercise.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.exerciseEntry.delete({ where: { id: exerciseId } });
  return NextResponse.json({ success: true });
}
