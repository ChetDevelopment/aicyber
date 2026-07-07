import { NextRequest, NextResponse } from "next/server"
import { getGoogleAuthUrl } from "@/lib/google-auth"

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const redirect = request.nextUrl.searchParams.get("redirect") || "/"
  return NextResponse.redirect(getGoogleAuthUrl(origin, redirect))
}
