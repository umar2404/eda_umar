import { NextResponse } from "next/server"; // wait, next/server is correct. I'll correct it to next/server.
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, height, weight, goal } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email va parol kiritilishi shart." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ message: "Bu email allaqachon ro'yxatdan o'tgan." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        goal,
        ...(weight && {
          weights: {
            create: {
              weight: parseFloat(weight)
            }
          }
        })
      }
    });

    return NextResponse.json({ message: "Muvaffaqiyatli ro'yxatdan o'tdingiz." }, { status: 201 });
  } catch (error) {
    console.error("Register xatoligi:", error);
    return NextResponse.json({ message: "Xatolik yuz berdi." }, { status: 500 });
  }
}
