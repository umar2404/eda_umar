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
    const days = parseInt(url.searchParams.get("days") || "30");
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const weights = await prisma.weightEntry.findMany({
      where: {
        user: { email: session.user?.email as string },
        date: { gte: startDate }
      },
      orderBy: { date: "asc" }
    });

    return NextResponse.json(weights);
  } catch (error) {
    console.error("Weight fetch error:", error);
    return NextResponse.json({ error: "Og'irlik ma'lumotini olishda xatolik" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { weight } = await req.json();
    if (!weight || weight <= 0) {
      return NextResponse.json({ error: "Og'irlik noto'g'ri" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user?.email || "" }
    });

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const entry = await prisma.weightEntry.create({
      data: { userId: user.id, weight: parseFloat(weight.toString()) }
    });

    // Update user's current weight
    await prisma.user.update({
      where: { id: user.id },
      data: { weight: parseFloat(weight.toString()) }
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Weight save error:", error);
    return NextResponse.json({ error: "Og'irlikni saqlashda xatolik" }, { status: 500 });
  }
}
