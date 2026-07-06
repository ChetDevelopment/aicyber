import { NextRequest, NextResponse } from "next/server"

const ALL_COOKIES = ["cyberai_session", "aiverse_local_session", "aiverse_google_session", "aiverse_github_session"]

export async function POST(request: NextRequest) {
  const isLocal = request.url.includes("localhost")
  const clearOptions: Record<string, unknown> = { path: "/", maxAge: 0 }
  if (!isLocal) clearOptions.domain = ".aiverse.app"

  const response = NextResponse.redirect(new URL("/", request.url))
  for (const name of ALL_COOKIES) {
    response.cookies.set(name, "", clearOptions)
  }
  return response
}
