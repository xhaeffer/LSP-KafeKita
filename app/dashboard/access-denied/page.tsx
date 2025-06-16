"use client"

import { useRouter } from 'nextjs-toploader/app';
import { Button } from "@/components/ui/button"
import { ShieldX } from "lucide-react"

export default function AccessDeniedPage() {
  const router = useRouter()
  
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <ShieldX size={64} className="text-destructive" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Access Denied</h1>
        <p className="mb-8 text-muted-foreground">
          You don&apos;t have permission to access this dashboard section.
        </p>
        <div className="space-x-4">
          <Button onClick={() => router.push("/")}>
            Go to Home
          </Button>
        </div>
      </div>
    </div>
  )
}