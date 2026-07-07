export interface SessionUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  provider: string
}

export function createSession(user: SessionUser): string {
  return Buffer.from(JSON.stringify(user)).toString("base64")
}

export function verifySession(token: string): SessionUser | null {
  try {
    return JSON.parse(Buffer.from(token, "base64").toString()) as SessionUser
  } catch {
    return null
  }
}
