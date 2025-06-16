"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { format } from "date-fns"
import { useTopLoader } from "nextjs-toploader"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"

import { OrderWithItems, OrderPaymentMethod } from "@/types/order"

import { auth } from "@/lib/firebase-client"
import { authFetch } from "@/lib/authFetch"

export default function CashierDashboardPage() {
  const loader = useTopLoader()

  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod>("cash")

  const fetchOrders = async () => {
    try {
      const res = await authFetch("/api/orders?status=pending")
      if (!res.ok) {
        throw new Error("Failed to fetch orders")
      }

      const data = await res.json()
      setOrders(data)

      if (!selectedOrder && data.length > 0) {
        setSelectedOrder(data[0])
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      toast.error("Gagal mengambil pesanan")
    }
  }

  const confirmOrder = async () => {
    if (!selectedOrder) return

    try {
      loader.start()

      const res = await authFetch(`/api/orders/${selectedOrder.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "confirmed",
          paymentMethod,
          cashierId: auth.currentUser?.uid
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to confirm order")
      }

      toast.success("Pesanan berhasil dikonfirmasi")

      setSelectedOrder(null)
      fetchOrders()
    } catch {
      console.error("Failed to confirm order")
      toast.error("Gagal mengonfirmasi pesanan")
    } finally {
      loader.done()
    }
  }

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const tax = 0
  const subtotal = selectedOrder?.items.reduce(
    (sum, item) => sum + item.priceSnapshot * item.quantity, 0
  ) || 0
  
  const total = subtotal + tax

  return (
    <div className="flex h-[100dvh]">
      <div className="w-[65%] p-4 border-r space-y-4">
        <div className="grid grid-cols-3 gap-3">
           { orders.length !== 0 ? orders.map(order => (
            <Card
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`p-4 cursor-pointer space-y-1 ${
                selectedOrder === order ? "border-2 border-black" : ""
              }`}
            >
              <div className="font-medium">Order #{order.id.slice(0, 6)}</div>
              <span className="text-sm text-slate-400">{format(new Date(order.createdAt), "dd MMM HH:mm")}</span>
            </Card>
            )) : (
            <Skeleton className="h-48 w-full" />
            )}
        </div>
      </div>
      <div className="w-[35%] p-6 flex flex-col justify-between bg-gray-100">
        {selectedOrder ? (
          <>
            <div>
              <h2 className="text-2xl font-semibold overflow-auto">
                Order #{selectedOrder.id}
              </h2>
              <div className="text-sm text-muted-foreground mb-8">
                <span>Table #{selectedOrder.tableNumber}</span>
                <span className="ml-4">
                  {format(new Date(selectedOrder.createdAt), "dd MMM HH:mm")}
                </span>
              </div>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>{item.quantity}x {item.nameSnapshot}</div>
                    <div>Rp. {item.priceSnapshot.toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex flex-row items-center justify-between mb-4">
                <span className="text-sm font-medium">Payment Method:</span>
                <Select
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as OrderPaymentMethod)}
                >
                  <SelectTrigger className="mt-1 w-40 bg-white">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="qris">QRIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-6 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp. {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (0%)</span>
                  <span>Rp. {tax.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <div className="flex justify-between text-xl font-bold mb-4">
                <div>Total:</div>
                <div>Rp. {total.toLocaleString("id-ID")}</div>
              </div>
              <Button className="w-full py-6 text-lg" onClick={confirmOrder}>
                Proceed
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground">
            No order selected
          </div>
        )}
      </div>
    </div>
  )
}
