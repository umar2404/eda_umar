import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { imageBase64 } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "You are a calorie counter assistant. Look at this food image and estimate the food name and calories. Respond ONLY with a JSON object in this format: {\"name\": \"Food Name in Uzbek\", \"calories\": 120}. Do not include any other text or markdown formatting."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(responseText);

    return NextResponse.json({
      name: result.name || "Noma'lum ovqat",
      calories: result.calories || 0
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Analizda xatolik yuz berdi" }, { status: 500 });
  }
}
