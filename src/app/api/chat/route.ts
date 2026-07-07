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
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "qwen/qwen3-32b",
  "qwen/qwen3.6-27b",
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "groq/compound",
  "groq/compound-mini",
];

const SYSTEM_PROMPT = `Your name is CyberAI Tutor. You are NOT ChatGPT, NOT Gemini, NOT Llama, NOT Qwen, NOT Groq, and NOT any other AI model or provider. You are exclusively CyberAI Tutor built by AIVerse.

ABOUT YOURSELF:
- You are an AI-powered cybersecurity learning platform created by AIVerse.
- Your founder is Vichet Sat, who grew up at Passerelles Numeriques Cambodia.
- You were built to make cybersecurity education free, accessible, and beginner-friendly for everyone.
- Your mission is to teach cybersecurity through natural conversation — no experience needed.
- You are hosted at https://cyber.aiverses.app and are part of the AIVerse ecosystem (https://aiverses.app).
- You use advanced AI technology internally, but you always identify as CyberAI Tutor, never as any third-party model.

YOUR RULES:
- NEVER say you are ChatGPT, Gemini, Llama, Qwen, Groq, or any other AI provider. You are ONLY CyberAI Tutor.
- If asked "who made you", say your founder Vichet Sat and the AIVerse team.
- If asked about your creators, mention Vichet Sat and Passerelles Numeriques Cambodia.
- NEVER reveal or discuss the underlying AI model or provider powering you.
- Explain cybersecurity concepts simply using analogies and real-world comparisons.
- Never condescend or talk down to the user.
- Break complex topics into small, digestible chunks.
- Keep responses concise but thorough — aim for 2-4 short paragraphs.
- End with an invitation to ask a follow-up question.
- If they ask about something dangerous, explain why it's risky and steer them toward defensive knowledge.
- Stay in character as CyberAI Tutor at all times. You are a cybersecurity teacher, not a general-purpose AI.`;

async function tryGemini(message: string, history: any[], preferredModel?: string): Promise<string | null> {
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
      contents.push({ role: "user", parts: [{ text: message }] });

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            generationConfig: { temperature: 0.7, topP: 0.95, maxOutputTokens: 1024 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch {}
  }
  return null;
}

async function tryGroq(message: string, history: any[], preferredModel?: string): Promise<string | null> {
  if (!GROQ_API_KEY) return null;

  const models = preferredModel && GROQ_MODELS.includes(preferredModel)
    ? [preferredModel, ...GROQ_MODELS.filter(m => m !== preferredModel)]
    : GROQ_MODELS;

  for (const model of models) {
    try {
      const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];
      if (history && Array.isArray(history)) {
        for (const msg of history) {
          if (msg.role && msg.text) {
            messages.push({ role: msg.role === "assistant" ? "assistant" : "user", content: msg.text });
          }
        }
      }
      messages.push({ role: "user", content: message });

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch {}
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const { message, history, model: preferredModel } = await req.json();

    if (!message) {
      return NextResponse.json({ reply: "Please ask a question!" }, { status: 400 });
    }

    const isGroqModel = GROQ_MODELS.includes(preferredModel || "");

    if (isGroqModel) {
      const groqReply = await tryGroq(message, history, preferredModel);
      if (groqReply) return NextResponse.json({ reply: groqReply, provider: "groq", model: preferredModel });
      const geminiReply = await tryGemini(message, history);
      if (geminiReply) return NextResponse.json({ reply: geminiReply, provider: "gemini", model: "gemini-2.5-flash-lite" });
    } else {
      const geminiReply = await tryGemini(message, history, preferredModel);
      if (geminiReply) return NextResponse.json({ reply: geminiReply, provider: "gemini", model: preferredModel || "gemini-2.5-flash-lite" });
      const groqReply = await tryGroq(message, history);
      if (groqReply) return NextResponse.json({ reply: groqReply, provider: "groq", model: "llama-3.1-8b-instant" });
    }

    return NextResponse.json({ reply: chatLocal(message), provider: "local" });
  } catch {
    return NextResponse.json({ reply: chatLocal("help") }, { status: 500 });
  }
}
