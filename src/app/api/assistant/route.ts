import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json(); // Expecting full messages array

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "Messages array is required." }, { status: 400 });
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // Your .env key
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // Replace with your domain if deployed
        "X-Title": "Kaddu Assistant", // Optional: name of your app
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // You can use other models like "mistral/mistral-7b-instruct"
        messages,
      }),
    });

    const data = await res.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    return NextResponse.json({ error: "Failed to connect to OpenRouter." }, { status: 500 });
  }
}
