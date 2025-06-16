/* eslint-disable @next/next/no-img-element */
import { Dispatch, SetStateAction } from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { OrderItemPreview } from "@/types/orderItem"
import { MenuCategoryPreview } from "@/types/menuCategories"
import { MenuItemPreviewWithCategory } from "@/types/menuItem"

type MenuSectionProps = {
  menuState: {
    categories: MenuCategoryPreview[],
    allItems: MenuItemPreviewWithCategory[],
    filteredItems: MenuItemPreviewWithCategory[],
    selectedCategory: MenuCategoryPreview | null,
  }
  setSelectedCategory: (category: MenuCategoryPreview) => void
  selectedItemData: {
    item: MenuItemPreviewWithCategory | null
    quantity: number
  }
  setSelectedItemData: Dispatch<SetStateAction<{
    item: MenuItemPreviewWithCategory | null;
    quantity: number;
  }>>
  orderItems: OrderItemPreview[]
  addToOrderList: () => void
  proceed: () => void
}

const MenuSection = ({
  menuState,
  setSelectedCategory,
  selectedItemData,
  setSelectedItemData,
  orderItems,
  addToOrderList,
  proceed,
}: MenuSectionProps) => {
  const changeQuantity = (qty: number) => {
    setSelectedItemData(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + qty),
    }))
  }

  return (
    <div className="min-h-screen bg-gray-200 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-64 py-4 sm:py-8 flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-10 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {menuState.selectedCategory?.name || "Menu"}
        </h1>
        <Button variant="outline" onClick={proceed} className="w-full sm:w-auto">
          View Cart ({orderItems.length})
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 lg:gap-24 flex-1">
        <div className="flex flex-row md:flex-col justify-center md:justify-normal gap-2 sm:gap-4 md:overflow-visible">
          {menuState.categories.map(cat => (
            <Button
              key={cat.id}
              variant="secondary"
              onClick={() => {
                setSelectedCategory(cat)
                setSelectedItemData({ item: null, quantity: 1 })
              }}
              className={`min-w-16 w-16 h-16 sm:w-20 sm:h-20 p-0 flex items-center justify-center rounded-md transition-all duration-200 flex-shrink-0
                ${cat === menuState.selectedCategory ? "ring-2 ring-blue-500 scale-105" : "ring-0 scale-100"}
              `}
            >
              {cat.imageUrl ? (
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="object-contain w-full h-full p-2"
                />
              ) : (
                <span className="text-xl sm:text-2xl">{cat.name[0]}</span>
              )}
            </Button>
          ))}
        </div>
        <div className="grid justify-items-center grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 flex-1 h-full">
          {menuState.filteredItems.map(item => (
            <Card
              key={item.id}
              onClick={() => setSelectedItemData({ item, quantity: 1 })}
              className={`cursor-pointer w-full max-w-3xs max-h-52
                ${selectedItemData.item === item ? "border-black border-2" : ""}
              `}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-2 sm:p-4 text-center">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="object-contain w-full h-24 sm:h-32"
                  />
                ) : (
                  <span className="text-2xl">{item.name[0]}</span>
                )}
                <span className="text-lg font-semibold">{item.name}</span>
                <span className="text-sm text-gray-500">Rp. {item.price.toLocaleString("id-ID")}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {selectedItemData.item && (
        <div className="bg-white p-4 mt-4">
          <div className="flex items-center justify-between text-lg font-medium mb-2 flex-wrap gap-2">
            <span>{selectedItemData.item.name}</span>
            <span>Rp. {(selectedItemData.item.price * selectedItemData.quantity).toLocaleString("id-ID")}</span>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="outline" onClick={() => changeQuantity(-1)}>
                <Minus size={16} />
              </Button>
              <span className="w-6 text-center">{selectedItemData.quantity}</span>
              <Button size="icon" variant="outline" onClick={() => changeQuantity(1)}>
                <Plus size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button
          variant="secondary"
          className="text-xl py-6"
          onClick={() => setSelectedItemData({ item: null, quantity: 1 })}
        >
          Cancel
        </Button>
        <Button
          className="text-xl py-6"
          onClick={addToOrderList}
          disabled={!selectedItemData.item}
        >
          Add to Order
        </Button>
      </div>
    </div>
  )
}

export default MenuSection
