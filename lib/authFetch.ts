import { auth } from "./firebase-client"

export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<Response> {
  const user = auth.currentUser
  if (!user) throw new Error("User not authenticated")

  const token = await user.getIdToken()
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}
