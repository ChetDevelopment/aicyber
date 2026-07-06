import { NextRequest, NextResponse } from "next/server"
import { exchangeGoogleCode, getGoogleUser } from "@/lib/google-auth"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const next = searchParams.get("next") ?? "/"

  if (error || !code) {
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed`)
  }

  try {
    const tokens = await exchangeGoogleCode(code, origin)
    const googleUser = await getGoogleUser(tokens.access_token)

    if (!googleUser.email) {
      return NextResponse.redirect(`${origin}/login?error=no_email`)
    }

    const session = {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name || googleUser.email.split("@")[0],
      avatarUrl: googleUser.picture || null,
      provider: "google",
    }

    const encoded = Buffer.from(JSON.stringify(session)).toString("base64")
    const target = `${origin}${next}`
    const domain = origin.includes("localhost") ? "" : "; domain=.aiverse.app"
    const cookie = `cyberai_session=${encoded}; path=/; ${origin.startsWith("https") ? "secure; " : ""}samesite=lax${domain}; max-age=${60 * 60 * 24 * 7}`

    const html = `<!DOCTYPE html><html><body><script>
      document.cookie = "${cookie}";
      window.location.href = "${target}";
    </script></body></html>`

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
        "Set-Cookie": cookie,
      },
    })
  } catch (e) {
    console.error("[GOOGLE_AUTH] Callback error:", e)
    return NextResponse.redirect(`${origin}/login?error=google_auth_failed`)
  }
}
