import { NextResponse } from "next/server";
import { chatLocal } from "@/lib/ai-engine";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;

const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
];

const GROQ_MODELS = [
  "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
];

const SYSTEM_PROMPT = `You are CyberAI Tutor, a friendly and encouraging cybersecurity teacher for beginners.

Rules:
- Explain concepts simply using analogies and real-world comparisons
- Never condescend or talk down to the user
- Break complex topics into small, digestible chunks
- Use examples from everyday life to illustrate security concepts
- Keep responses concise but thorough — aim for 2-4 short paragraphs
- End with an invitation to ask a follow-up question
- If they ask about something dangerous, explain why it's risky and steer them toward defensive knowledge
- If the user shares an image, analyze it for cybersecurity relevance`;

async function tryGemini(
  message: string,
  history: any[],
  preferredModel?: string,
  images?: { mimeType: string; data: string }[]
): Promise<{ text: string; model: string } | null> {
  if (!GEMINI_API_KEY) return null;

  const models = preferredModel && GEMINI_MODELS.includes(preferredModel)
    ? [preferredModel, ...GEMINI_MODELS.filter(m => m !== preferredModel)]
    : GEMINI_MODELS;

  for (const model of models) {
    try {
      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          if (msg.role && msg.text) {
            contents.push({ role: msg.role === "assistant" ? "model" : "user", parts: [{ text: msg.text }] });
          }
        }
      }

      const parts: any[] = [{ text: message }];
      if (images && images.length > 0) {
        for (const img of images) {
          parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
        }
      }
      contents.push({ role: "user", parts });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { temperature: 0.7, topP: 0.95, maxOutputTokens: 2048 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return { text, model };
      }
    } catch {}
  }
  return null;
}

async function tryGroq(
  message: string,
  history: any[],
  preferredModel?: string,
  images?: { mimeType: string; data: string }[]
): Promise<{ text: string; model: string } | null> {
  if (!GROQ_API_KEY) return null;

  const models = preferredModel && GROQ_MODELS.includes(preferredModel)
    ? [preferredModel, ...GROQ_MODELS.filter(m => m !== preferredModel)]
    : GROQ_MODELS;

  for (const model of models) {
    try {
      const groqMessages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          if (msg.role && msg.text) {
            groqMessages.push({ role: msg.role === "assistant" ? "assistant" : "user", content: msg.text });
          }
        }
      }

      let content: any = message;
      if (images && images.length > 0) {
        content = [
          { type: "text", text: message },
          ...images.map(img => ({ type: "image_url", image_url: { url: `data:${img.mimeType};base64,${img.data}` } })),
        ];
      }
      groqMessages.push({ role: "user", content });

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({ model, messages: groqMessages, temperature: 0.7, max_tokens: 2048 }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return { text, model };
      }
    } catch {}
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { message, history, model: preferredModel, images } = await req.json();
    if (!message) {
      return NextResponse.json({ reply: "Please ask a question!" }, { status: 400 });
    }

    const hasImages = images && images.length > 0;
    const isGroqModel = GROQ_MODELS.includes(preferredModel || "");

    if (isGroqModel) {
      const groqReply = await tryGroq(message, history, preferredModel, images);
      if (groqReply) return NextResponse.json({ reply: groqReply.text, model: groqReply.model, provider: "groq" });
      if (!hasImages) {
        const geminiReply = await tryGemini(message, history);
        if (geminiReply) return NextResponse.json({ reply: geminiReply.text, model: geminiReply.model, provider: "gemini" });
      }
    } else {
      const geminiReply = await tryGemini(message, history, preferredModel, images);
      if (geminiReply) return NextResponse.json({ reply: geminiReply.text, model: geminiReply.model, provider: "gemini" });
      if (!hasImages) {
        const groqReply = await tryGroq(message, history);
        if (groqReply) return NextResponse.json({ reply: groqReply.text, model: groqReply.model, provider: "groq" });
      }
    }

    return NextResponse.json({ reply: chatLocal(message), provider: "local" });
  } catch {
    return NextResponse.json({ reply: chatLocal("help") }, { status: 500 });
  }
}
