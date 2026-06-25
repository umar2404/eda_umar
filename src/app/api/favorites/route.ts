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
    const mealType = url.searchParams.get("mealType");

    const favorites = await prisma.favoriteFoods.findMany({
      where: {
        user: { email: session.user?.email },
        ...(mealType && { mealType })
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Favorites fetch error:", error);
    return NextResponse.json({ error: "Sevimli ovqatlarni olishda xatolik" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, calories, protein, carbs, fat, fiber, mealType = "other" } = await req.json();

    if (!name || !calories) {
      return NextResponse.json({ error: "Nomi va kaloriya kerak" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" }
    });

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const favorite = await prisma.favoriteFoods.upsert({
      where: { userId_name: { userId: user.id, name } },
      update: { calories: parseInt(calories), protein, carbs, fat, fiber, mealType },
      create: {
        userId: user.id,
        name,
        calories: parseInt(calories),
        protein: protein || null,
        carbs: carbs || null,
        fat: fat || null,
        fiber: fiber || null,
        mealType
      }
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Favorite save error:", error);
    return NextResponse.json({ error: "Sevimli ovqatni saqlashda xatolik" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const url = new URL(req.url);
    const foodName = url.searchParams.get("name");

    if (!foodName) {
      return NextResponse.json({ error: "Ovqat nomi kerak" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" }
    });

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await prisma.favoriteFoods.delete({
      where: { userId_name: { userId: user.id, name: foodName } }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Favorite delete error:", error);
    return NextResponse.json({ error: "Sevimli ovqatni o'chirishda xatolik" }, { status: 500 });
  }
}
