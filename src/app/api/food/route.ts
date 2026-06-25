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

  const foods = await prisma.foodEntry.findMany({
    where: {
      userId: user.id,
      date: { gte: startDate }
    },
    orderBy: { date: "desc" }
  });

  return NextResponse.json(foods);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user?.email as string } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { name, calories, protein, carbs, fat, fiber, sodium, sugar, mealType, serving, imageUrl } = await req.json();

  if (!name || !calories) {
    return NextResponse.json({ error: "Name and calories required" }, { status: 400 });
  }

  const food = await prisma.foodEntry.create({
    data: {
      userId: user.id,
      name,
      calories: parseInt(calories),
      protein: protein ? parseFloat(protein) : null,
      carbs: carbs ? parseFloat(carbs) : null,
      fat: fat ? parseFloat(fat) : null,
      fiber: fiber ? parseFloat(fiber) : null,
      sodium: sodium ? parseFloat(sodium) : null,
      sugar: sugar ? parseFloat(sugar) : null,
      mealType: mealType || "other",
      serving: serving || null,
      imageUrl: imageUrl || null
    }
  });

  return NextResponse.json(food, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { email: session.user?.email as string } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const url = new URL(req.url);
  const foodId = url.searchParams.get("id");

  if (!foodId) {
    return NextResponse.json({ error: "Food ID required" }, { status: 400 });
  }

  const food = await prisma.foodEntry.findUnique({ where: { id: foodId } });
  if (!food || food.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.foodEntry.delete({ where: { id: foodId } });
  return NextResponse.json({ success: true });
}
