"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { useRouter } from 'nextjs-toploader/app';
import { useTopLoader } from 'nextjs-toploader';
import { signInWithEmailAndPassword } from "firebase/auth"

import { cn } from "@/lib/utils"
import { auth } from "@/lib/firebase-client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FirebaseError } from "firebase/app"

export const LoginForm = ({ className, ...props}: React.ComponentProps<"div">) => {
  const loader = useTopLoader();
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    loader.start();

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/dashboard")
    } catch (err: unknown) {
      const firebaseError = err as FirebaseError

      if (firebaseError.code === 'auth/invalid-credential') {
        toast.error('Email atau password tidak valid. Silakan coba lagi.')
      } else if (firebaseError.code === 'auth/too-many-requests') {
        toast.error('Terlalu banyak permintaan. Silakan coba lagi nanti.')
      } else if (firebaseError.code === 'auth/user-disabled') {
        toast.error('Akun Anda telah dinonaktifkan. Silakan hubungi administrator.')
      } else {
        console.error("Login error:", err)
        toast.error('Terjadi kesalahan saat masuk. Silakan coba lagi.')
      }
    } finally {
      loader.done();
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
