import { auth } from "@/lib/firebase-admin"

export async function authGuard(req: Request) {
  const authHeader = req.headers.get("Authorization")
  const token = authHeader?.split("Bearer ")[1]

  if (!token) return null

  try {
    const decodedToken = await auth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error("Token verification failed", error)
    return null
  }
}

export async function requireRole(req: Request, allowedRoles: string[]) {
  const user = await authGuard(req)
  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }
  return user
}