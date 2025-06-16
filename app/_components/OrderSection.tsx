/* eslint-disable @next/next/no-img-element */
import { Minus, Plus } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { MenuItemPreviewWithCategory } from "@/types/menuItem"

type OrderSectionProps = {
  menuItems: MenuItemPreviewWithCategory[]
  orderItems: { menuItemId: string; quantity: number; note?: string }[]
  updateOrderItem: (id: string, delta: number) => void
  updateNote: (id: string, note: string) => void
  cancel: () => void
  proceed: () => void
}

const OrderSection = ({
  menuItems,
  orderItems,
  updateOrderItem,
  updateNote,
  cancel,
  proceed,
}: OrderSectionProps) => {
  const total = orderItems.reduce((acc, item) => {
    const m = menuItems.find(m => m.id === item.menuItemId)
    return acc + (m?.price || 0) * item.quantity
  }, 0)

  return (
    <div className="min-h-screen bg-gray-200 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-64 py-8 flex flex-col">
      <h1 className="text-3xl font-bold mb-4">Order List</h1>
      <div className="flex flex-col gap-4 flex-1">
        {orderItems.map((item, idx) => {
          const menu = menuItems.find(m => m.id === item.menuItemId)
          return (
            <div key={idx} className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-between bg-white p-4">
              <div className="flex items-center">
                <img
                  src={menu?.imageUrl}
                  alt={menu?.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col w-full">
                <div className="text-xl font-medium">{menu?.name}</div>
                <span className="text-sm text-gray-500 mb-4">Rp. {menu?.price.toLocaleString("id-ID")}</span>
                <Input
                  placeholder="Add custom instruction"
                  value={item.note || ""}
                  onChange={e => updateNote(item.menuItemId, e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button size="icon" onClick={() => updateOrderItem(item.menuItemId, -1)}>
                  <Minus size={16} />
                </Button>
                <span className="w-6 text-center">{item.quantity}</span>
                <Button size="icon" onClick={() => updateOrderItem(item.menuItemId, 1)}>
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-between bg-white px-4 py-2 mt-4 text-xl font-semibold">
        <span>Total:</span>
        <span>Rp. {total.toLocaleString("id-ID")}</span>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button variant="secondary" className="text-xl py-6" onClick={cancel}>
          Cancel
        </Button>
        <Button className="text-xl py-6" onClick={proceed}>
          Proceed
        </Button>
      </div>
    </div>
  )
}

export default OrderSection
