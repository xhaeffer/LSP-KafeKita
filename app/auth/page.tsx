"use client"

import { useEffect } from "react"
import { useRouter } from "nextjs-toploader/app"

import { LoginForm } from "./_components/login-form"

import { useAuth } from "@/hooks/useAuth"

export default function AuthPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (user && !loading) {
      router.push("/dashboard")
      return
    }
  }, [user, loading, router])


  if (!user) {
    return (
      <div className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
        <LoginForm className="w-full max-w-sm"/>
      </div>
    )
  }

  return null
}
