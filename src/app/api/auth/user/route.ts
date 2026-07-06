import { NextRequest, NextResponse } from "next/server"

const AIVERSE_COOKIES = ["aiverse_local_session", "aiverse_google_session", "aiverse_github_session"]

export async function GET(request: NextRequest) {
  const session = request.cookies.get("cyberai_session")
  if (session?.value) {
    try {
      const data = JSON.parse(Buffer.from(session.value, "base64").toString())
      if (data.email) {
        return NextResponse.json({
          user: {
            id: data.id,
            email: data.email,
            name: data.name || data.email.split("@")[0],
            avatarUrl: data.avatarUrl || null,
            provider: data.provider || "local",
          },
        })
      }
    } catch {}
  }

  for (const name of AIVERSE_COOKIES) {
    const cookie = request.cookies.get(name)
    if (cookie?.value) {
      try {
        const data = JSON.parse(Buffer.from(cookie.value, "base64").toString())
        if (data.email) {
          return NextResponse.json({
            user: {
              id: data.id,
              email: data.email,
              name: data.name || data.email.split("@")[0],
              avatarUrl: data.avatarUrl || null,
              provider: `aiverse_${name.replace("aiverse_", "").replace("_session", "")}`,
            },
          })
        }
      } catch {}
    }
  }

  return NextResponse.json({ user: null })
}
