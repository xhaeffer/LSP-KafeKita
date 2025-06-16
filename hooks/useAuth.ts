import { useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"

import { auth } from "@/lib/firebase-client"

import { StaffRole } from "@/types/staff"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<StaffRole | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        try {
          const tokenResult = await firebaseUser.getIdTokenResult()
          setRole(tokenResult.claims.role as StaffRole || null)
        } catch (error) {
          console.error("Error fetching token:", error)
          setRole(null)
        }
      } else {
        setRole(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { user, loading, role }
}
