import { NextRequest, NextResponse } from "next/server"
import { exchangeGoogleCode, getGoogleUser } from "@/lib/google-auth"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const errorParam = searchParams.get("error")
  const next = searchParams.get("next") ?? "/"

  if (errorParam || !code) {
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed`)
  }

  try {
    const tokens = await exchangeGoogleCode(code, origin)
    const googleUser = await getGoogleUser(tokens.access_token)

    if (!googleUser.email) {
      return NextResponse.redirect(`${origin}/login?error=no_email`)
    }

    const user = await prisma.user.upsert({
      where: { email: googleUser.email },
      update: { name: googleUser.name, avatarUrl: googleUser.picture || null },
      create: { id: googleUser.id, email: googleUser.email, name: googleUser.name || googleUser.email.split("@")[0], avatarUrl: googleUser.picture || null, provider: "google" },
    })

    const token = createSession({ id: user.id, email: user.email, name: user.name, avatarUrl: user.avatarUrl, provider: "google" })
    const target = `${origin}${next}`
    const cookie = `cyberai_session=${token}; path=/; ${origin.startsWith("https") ? "secure; " : ""}samesite=lax; max-age=${60 * 60 * 24 * 7}`

    const html = `<!DOCTYPE html><html><body><script>document.cookie="${cookie}";window.location.href="${target}";</script></body></html>`

    return new Response(html, { status: 200, headers: { "Content-Type": "text/html", "Set-Cookie": cookie } })
  } catch (e) {
    console.error("[GOOGLE_AUTH]", e)
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed`)
  }
}
