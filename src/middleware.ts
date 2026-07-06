import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedRoutes = ["/chat"]
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtected) {
    const session = request.cookies.get("cyberai_session")
    const aiverseCookies = ["aiverse_local_session", "aiverse_google_session", "aiverse_github_session"]

    let authenticated = false

    if (session?.value) {
      try {
        const data = JSON.parse(Buffer.from(session.value, "base64").toString())
        if (data.email) authenticated = true
      } catch {}
    }

    if (!authenticated) {
      for (const name of aiverseCookies) {
        const cookie = request.cookies.get(name)
        if (cookie?.value) {
          try {
            const data = JSON.parse(Buffer.from(cookie.value, "base64").toString())
            if (data.email) { authenticated = true; break }
          } catch {}
        }
      }
    }

    if (!authenticated) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/chat/:path*", "/chat"],
}
