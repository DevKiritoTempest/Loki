import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { message } = await req.json();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: message,
    });

    return new Response(JSON.stringify({ reply: response.choices[0].message }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
    });
  }
}
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { message } = await req.json();

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Você é POOL, mestre de copywriting, redes sociais, anúncios e comunicação." },
      ...message
    ]
  });

  return new Response(JSON.stringify({ reply: response.choices[0].message }), {
    headers: { "Content-Type": "application/json" },
  });
}
