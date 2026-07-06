import { NextRequest, NextResponse } from "next/server"
import { exchangeGithubCode, getGithubUser } from "@/lib/github-auth"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")
  const next = searchParams.get("next") ?? "/"

  if (error || !code) {
    return NextResponse.redirect(`${origin}/login?error=github_auth_failed`)
  }

  try {
    const tokens = await exchangeGithubCode(code, origin)
    const githubUser = await getGithubUser(tokens.access_token)

    if (!githubUser.email) {
      return NextResponse.redirect(`${origin}/login?error=no_email`)
    }

    const session = {
      id: githubUser.id,
      email: githubUser.email,
      name: githubUser.name || githubUser.email.split("@")[0],
      avatarUrl: githubUser.picture || null,
      provider: "github",
    }

    const encoded = Buffer.from(JSON.stringify(session)).toString("base64")
    const target = `${origin}${next}`
    const domain = origin.includes("localhost") ? "" : `; domain=.${new URL(origin).hostname.split(".").slice(-2).join(".")}`
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
    console.error("[GITHUB_AUTH] Callback error:", e)
    return NextResponse.redirect(`${origin}/login?error=github_auth_failed`)
  }
}
