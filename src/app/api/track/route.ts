import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { country, city, ip, time } = await req.json();
    if (!country) return NextResponse.json({ ok: false }, { status: 400 });

    const entry = { country, city: city || "Unknown", ip: ip || "Unknown", time: time || Date.now() };

    return NextResponse.json({ ok: true, entry });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
