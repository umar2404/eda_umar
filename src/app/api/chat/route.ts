import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { messages } = await req.json();

    const systemPrompt = {
      role: "system",
      content: `Sizning ismingiz "AI Maslahatchi". Siz Eda (Calorie Tracker) ilovasida foydalanuvchilarning shaxsiy dietologi va fitness treneyi hisoblanasiz. 
Vazifangiz:
- Foydalanuvchiga do'stona, ilhomlantiruvchi va qisqa maslahatlar berish.
- O'zbek tilida (lotin alifbosida) ravon, xatosiz, professional lekin samimiy gapirish.
- Dietalar, mashqlar, vazn tashlash, qorin yo'qotish kabi savollarga qisqa ro'yxatlar bilan javob berish.
- Juda uzun paragraflar o'rniga qisqa jumlalar va emoji lardan foydalanish.
- Foydalanuvchining ismini (agar bilsangiz yoki kontekstda bo'lsa) qo'llab-quvvatlash.
Qoidalarni unutmang: Javobingiz juda uzoq bo'lmasin, suhbatdoshni zeriktirmang, Markdown formatida (qalin, ro'yxat) chiroyli yozing.`
    };

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [systemPrompt, ...messages],
      temperature: 0.7,
      max_tokens: 800,
    });

    const reply = completion.choices[0]?.message?.content || "Kechirasiz, hozir tushunmadim.";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 });
  }
}
