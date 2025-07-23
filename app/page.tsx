"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useTopLoader } from "nextjs-toploader"

import { OrderItemPreview } from "@/types/orderItem"
import { MenuCategoryPreview } from "@/types/menuCategories"
import { MenuItemPreviewWithCategory } from "@/types/menuItem"
import { OrderPayload, OrderPaymentMethod } from "@/types/order"

import MenuSection from "./_components/MenuSection"
import OrderSection from "./_components/OrderSection"
import TableSection from "./_components/TableSection"
import PaymentSection from "./_components/PaymentSection"

export default function KioskMenu() {
  const loader = useTopLoader()
  
  const [step, setStep] = useState<"menu" | "order" | "table" | "payment">("menu")

  const [menuState, setMenuState] = useState({
    categories: [] as MenuCategoryPreview[],
    allItems: [] as MenuItemPreviewWithCategory[],
    filteredItems: [] as MenuItemPreviewWithCategory[],
    selectedCategory: null as MenuCategoryPreview | null,
  })

  const [selectedItemData, setSelectedItemData] = useState<{
    item: MenuItemPreviewWithCategory | null
    quantity: number
  }>({ item: null, quantity: 1 })

  const [orderState, setOrderState] = useState({
    items: [] as OrderItemPreview[],
    tableNumber: 1,
    paymentMethod: "cash" as OrderPaymentMethod,
  })

  const fetchCategories = async (): Promise<MenuCategoryPreview[]> => {
    try {
      const res = await fetch("/api/menu-categories")
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch categories")
      }

      return res.json()
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Gagal mengambil kategori menu")
      
      return []
    }
  }

  const fetchMenuItems = async (categoryId?: string): Promise<MenuItemPreviewWithCategory[]> => {
    try {
      loader.start()

      const res = await fetch(`/api/menu?${categoryId ? `categoryId=${categoryId}&` : ''}`)
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch menu items")
      }
      
      return res.json()
    } catch (error) {
      console.error("Error fetching menu items:", error)
      toast.error("Gagal mengambil item menu")

      return []
    } finally {
      loader.done()
    }
  }

  const createOrder = async (payload: OrderPayload) => {
    try {
      loader.start()

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to create order")
      }

      toast.success("Pesanan berhasil dibuat")
      return await res.json()
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("Gagal membuat pesanan")

      return null
    } finally {
      loader.done()
    }

  }

  const addToOrderList = () => {
    if (!selectedItemData.item) return

    setOrderState(prev => {
      const existing = prev.items.find(i => i.menuItemId === selectedItemData.item!.id)
      const updatedItems = existing
        ? prev.items.map(i => i.menuItemId === selectedItemData.item!.id
            ? { ...i, quantity: i.quantity + selectedItemData.quantity }
            : i)
        : [...prev.items, { menuItemId: selectedItemData.item!.id, quantity: selectedItemData.quantity }]

      return { ...prev, items: updatedItems }
    })

    toast.success("Item berhasil ditambahkan ke pesanan")
    setSelectedItemData({ item: null, quantity: 1 })
  }

  const updateOrderItem = (id: string, delta: number) => {
    setOrderState(prev => ({
      ...prev,
      items: prev.items
        .map(item => {
          if (item.menuItemId !== id) return item;

          const menu = menuState.allItems.find((menu) => menu.id === item.menuItemId)!
          if (item.quantity < menu.stock) return null

          const newQuantity = item.quantity + delta;
          if (newQuantity <= 0) return null;

          return { ...item, quantity: newQuantity };
        })
        .filter(item => item !== null)
    }));
  };

  const updateNote = (id: string, note: string) => {
    setOrderState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.menuItemId === id ? { ...item, note } : item
      )
    }))
  }

  const handleSubmit = async () => {
    const payload: OrderPayload = {
      status: orderState.paymentMethod === "cash" ? "pending" : "confirmed",
      paymentMethod: orderState.paymentMethod,
      tableNumber: orderState.tableNumber,
      items: orderState.items,
    }

    await createOrder(payload)

    setOrderState({ items: [], tableNumber: "1", paymentMethod: "cash" })
    setStep("menu")
  }

  useEffect(() => {
    const loadMenuData = async () => {
      const allItems: MenuItemPreviewWithCategory[] = await fetchMenuItems()
      let filteredItems: MenuItemPreviewWithCategory[] = []

      const categories = await fetchCategories()

      const selectedCategory = categories[0] || null
      if (selectedCategory) {
        filteredItems = await fetchMenuItems(selectedCategory.id)
      }

      setMenuState({ categories, selectedCategory, allItems, filteredItems })
    }
    loadMenuData()
  }, [])

  useEffect(() => {
    const fetchItems = async () => {
      if (!menuState.selectedCategory) return

      const filteredItems = await fetchMenuItems(menuState.selectedCategory.id)

      setMenuState(prev => ({ ...prev, filteredItems }))
      setSelectedItemData({ item: null, quantity: 1 })
    }
    fetchItems()
  }, [menuState.selectedCategory])

  return (
    <>
      {step === "menu" && (
        <MenuSection
          menuState={menuState}
          setSelectedCategory={val => setMenuState(prev => ({ ...prev, selectedCategory: val }))}
          selectedItemData={selectedItemData}
          setSelectedItemData={setSelectedItemData}
          orderItems={orderState.items}
          addToOrderList={addToOrderList}
          proceed={() => setStep("order")}
        />
      )}

      {step === "order" && (
        <OrderSection
          menuItems={menuState.allItems}
          orderItems={orderState.items}
          updateOrderItem={updateOrderItem}
          updateNote={updateNote}
          cancel={() => setStep("menu")}
          proceed={() => setStep("table")}
        />
      )}

      {step === "table" && (
        <TableSection
          tableNumber={orderState.tableNumber}
          setTableNumber={val => setOrderState(prev => ({ ...prev, tableNumber: val }))}
          cancel={() => setStep("order")}
          proceed={() => setStep("payment")}
        />
      )}

      {step === "payment" && (
        <PaymentSection
          paymentMethod={orderState.paymentMethod}
          setPaymentMethod={val => setOrderState(prev => ({ ...prev, paymentMethod: val }))}
          cancel={() => setStep("table")}
          submit={handleSubmit}
        />
      )}
    </>
  )
}
