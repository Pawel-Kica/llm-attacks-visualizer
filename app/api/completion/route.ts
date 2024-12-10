// app/api/completion/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(request: Request) {
  const { prompt, llm } = await request.json();

  if (!prompt || !llm) {
    return NextResponse.json(
      { error: "Prompt or LLM is missing" },
      { status: 400 }
    );
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API isn't configured" },
      { status: 500 }
    );
  }
  console.log("LLM:", llm);
  try {
    const response = await openai.chat.completions.create({
      model: llm.toLowerCase(),
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });
    console.log(JSON.stringify(response, null, 2));

    return NextResponse.json({ result: response.choices[0]?.message?.content });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return NextResponse.json(
      { error: "Failed to get response from OpenAI" },
      { status: 500 }
    );
  }
}
