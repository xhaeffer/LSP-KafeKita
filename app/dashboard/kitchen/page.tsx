"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { useTopLoader } from "nextjs-toploader"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

import { OrderPreviewWithItems } from "@/types/order"

import { authFetch } from "@/lib/authFetch"

export default function KitchenDashboardPage() {
  const loader = useTopLoader();

  const [orders, setOrders] = useState<OrderPreviewWithItems[] | null>(null)

  const getNextStatus = (status: string) => {
    switch (status) {
      case "confirmed": return "preparing"
      case "preparing": return "ready"
      case "ready": return "finished"
      default: return null
    }
  }

  const getBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "preparing":
        return "bg-yellow-100 text-yellow-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "finished":
        return "bg-gray-100 text-gray-700"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return ""
    }
  }

  const fetchOrders = async () => {
    try {
      const statusParams = ["confirmed", "preparing", "ready"]
        .map(s => `status=${s}`)
        .join("&")

      const res = await authFetch(`/api/orders?${statusParams}`)
      if (!res.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Gagal mengambil pesanan")
    }
  }

  const updateOrderStatus = async (orderId: string, currentStatus: string) => {
    const next = getNextStatus(currentStatus)
    if (!next) return

    try {
      loader.start();

      const res = await authFetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      })
      
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update order status")
      }

      toast.success(`Status pesanan: ${next}`)
      fetchOrders()
    } catch (error) {
      console.error("Failed to update order status:", error)
      toast.error("Gagal memperbarui status pesanan")
    } finally {
      loader.done();
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-6">
      {!orders ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {orders.map(order => (
            <Card key={order.id}>
              <CardContent className="flex flex-col gap-2 h-full">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{format(new Date(order.createdAt), "dd MMM HH:mm")}</span>
                  <Badge className={getBadgeClass(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div className="font-semibold text-lg">
                  Table #{order.tableNumber}
                </div>
                <ul className="text-sm pl-4 list-disc flex-1">
                  {order.items.map((item, idx) => (
                    <>
                      <li key={idx}>
                        {item.quantity}x {item.nameSnapshot}
                      </li>
                      {item.note && ` (${item.note})`}
                    </>
                  ))}
                </ul>
                {getNextStatus(order.status) && (
                  <Button
                    className="mt-2 w-full"
                    onClick={() => updateOrderStatus(order.id, order.status)}
                  >
                    Mark as {getNextStatus(order.status)}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
