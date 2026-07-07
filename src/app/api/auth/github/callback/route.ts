import { NextRequest, NextResponse } from "next/server"
import { exchangeGithubCode, getGithubUser } from "@/lib/github-auth"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/auth"

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

    const dbUser = await prisma.user.upsert({
      where: { email: githubUser.email },
      update: {
        name: githubUser.name || githubUser.email.split("@")[0],
        avatarUrl: githubUser.picture || null,
      },
      create: {
        id: githubUser.id,
        email: githubUser.email,
        name: githubUser.name || githubUser.email.split("@")[0],
        avatarUrl: githubUser.picture || null,
        provider: "github",
      },
    })

    const token = await createSession({
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name || dbUser.email.split("@")[0],
      avatarUrl: dbUser.avatarUrl || null,
      provider: "github",
    })

    const target = `${origin}${next}`

    const html = `<!DOCTYPE html><html><body><script>
      document.cookie = "cyberai_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${origin.startsWith("https") ? "; Secure" : ""}";
      window.location.href = "${target}";
    </script></body></html>`

    return new Response(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (e) {
    console.error("[GITHUB_AUTH] Callback error:", e)
    return NextResponse.redirect(`${origin}/login?error=github_auth_failed`)
  }
}
