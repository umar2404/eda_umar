import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Text is required" }, { status: 400 });

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: `Siz dietolog va kaloriya hisoblovchi yordamchisiz. Foydalanuvchi quyidagi ovqat nomini kiritdi: "${text}".
Iltimos, ushbu ovqatning taxminiy kaloriya va makronutrientlarini (o'rtacha porsiya uchun) aniqlang.
Faqatgina quyidagi JSON formatida javob bering, boshqa hech qanday izoh yoki matn qo'shmang:
{
  "name": "Ovqatning to'g'rilangan nomi",
  "calories": 450,
  "protein": 20,
  "carbs": 50,
  "fat": 15,
  "fiber": 5
}`
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(responseText);

    return NextResponse.json({
      name: result.name || text,
      calories: result.calories || 0,
      protein: result.protein || 0,
      carbs: result.carbs || 0,
      fat: result.fat || 0,
      fiber: result.fiber || 0
    });
  } catch (error) {
    console.error("AI Text Analysis Error:", error);
    return NextResponse.json({ error: "Analizda xatolik yuz berdi" }, { status: 500 });
  }
}
