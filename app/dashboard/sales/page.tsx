"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useTopLoader } from "nextjs-toploader"

import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { authFetch } from "@/lib/authFetch"

import { OrderWithItems } from "@/types/order"

export default function SalesSummarySection() {
  const loader = useTopLoader()

  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState<number>(0)
  const [topItems, setTopItems] = useState<{ name: string; qty: number }[]>([])

  const fetchSales = async () => {
    try {
      setLoading(true)
      loader.start()

      const today = new Date()
      const start = new Date(today.setHours(0, 0, 0, 0))
      const end = new Date(today.setHours(23, 59, 59, 999))

      const query = new URLSearchParams({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      })

      const res = await authFetch(`/api/orders?${query.toString()}`)
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch sales data")
      }

      const orders = await res.json() as OrderWithItems[]

      let totalSales = 0
      const itemMap: Record<string, { name: string; qty: number; price: number }> = {}

      for (const order of orders) {
        for (const item of order.items || []) {
          const id = item.menuItemId
          const itemTotal = item.priceSnapshot * item.quantity
          totalSales += itemTotal

          if (!itemMap[id]) {
            itemMap[id] = {
              name: item.nameSnapshot,
              qty: 0,
              price: item.priceSnapshot,
            }
          }

          itemMap[id].qty += item.quantity
        }
      }
      setTotal(totalSales)

      const top = Object.values(itemMap)
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5)
        .map(({ name, qty }) => ({ name, qty }))
      setTopItems(top)
    } catch (error) {
      console.error("Error fetching sales data:", error)
      toast.error("Gagal mengambil data penjualan")
    } finally {
      setLoading(false)
      loader.done()
    }
  }

  useEffect(() => {
    fetchSales()
  }, [])

  return (
    <div className="p-6 space-y-6">
      {loading ? (
        <>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-40 w-full" />
        </>
      ) : (
        <>
          <Card className="p-6 space-y-2">
            <h2 className="text-lg font-semibold">Total Penjualan Hari Ini</h2>
            <div className="text-2xl font-bold">
              Rp {total.toLocaleString("id-ID")}
            </div>
          </Card>

          <Card className="p-6 space-y-2">
            <h2 className="text-lg font-semibold">Top Menu Hari Ini</h2>
            {topItems.length === 0 ? (
              <p className="text-muted-foreground">Belum ada transaksi hari ini.</p>
            ) : (
              <ol className="list-decimal pl-4 space-y-1">
                {topItems.map((item, i) => (
                  <li key={i}>{item.name} – {item.qty}x</li>
                ))}
              </ol>
            )}
          </Card>
        </>
      )}
    </div>
  )
}