const CLIENT_ID = process.env.GITHUB_CLIENT_ID || ""
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || ""

export function getGithubAuthUrl(origin: string) {
  const redirectUri = `${origin}/api/auth/github/callback`
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
    scope: "read:user user:email",
  })
  return `https://github.com/login/oauth/authorize?${params}`
}

export async function exchangeGithubCode(code: string, origin: string) {
  const redirectUri = `${origin}/api/auth/github/callback`
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Token exchange failed: ${err}`)
  }
  const data = await res.json()
  if (data.error) throw new Error(`GitHub OAuth error: ${data.error}`)
  return data as { access_token: string }
}

export async function getGithubUser(accessToken: string) {
  const res = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) throw new Error("Failed to get user info")
  const user = await res.json() as {
    id: number
    login: string
    name: string | null
    email: string | null
    avatar_url: string
  }

  if (!user.email) {
    const emailsRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (emailsRes.ok) {
      const emails = await emailsRes.json() as { email: string; primary: boolean }[]
      const primary = emails.find((e) => e.primary)
      if (primary) user.email = primary.email
    }
  }

  return {
    id: String(user.id),
    email: user.email || `${user.login}@github.com`,
    name: user.name || user.login,
    picture: user.avatar_url,
  }
}
