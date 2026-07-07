import { NextRequest, NextResponse } from "next/server"
import { getGithubAuthUrl } from "@/lib/github-auth"

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const redirect = request.nextUrl.searchParams.get("redirect") || "/"
  return NextResponse.redirect(getGithubAuthUrl(origin, redirect))
}
