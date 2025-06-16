"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useTopLoader } from "nextjs-toploader"
import { Plus, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { authFetch } from "@/lib/authFetch"
import { MenuItem } from "@/types/menuItem"
import { MenuCategoryPreview } from "@/types/menuCategories"

const ManageMenu = () => {
  const loader = useTopLoader()

  const [menus, setMenus] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategoryPreview[]>([])

  const [form, setForm] = useState({
    id: "",
    name: "",
    price: "",
    imageUrl: "",
    categoryId: "",
    isAvailable: true
  })

  const [dialogVisible, setDialogVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchMenus = async () => {
    try {
      loader.start()
      
      const res = await authFetch("/api/menu")
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch menus")
      }

      const data = await res.json()
      setMenus(data)
    } catch (error) {
      console.error("Error fetching menus:", error)
      toast.error("Gagal memuat data menu")
    } finally {
      loader.done()
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await authFetch("/api/menu-categories")
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch categories")
      }

      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Gagal memuat kategori")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isEdit = Boolean(form.id)
    const url = isEdit ? `/api/menu/${form.id}` : "/api/menu"
    const method = isEdit ? "PATCH" : "POST"

    try {
      setLoading(true)
      loader.start()

      const res = await authFetch(url, {
        method,
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          imageUrl: form.imageUrl || undefined,
          categoryId: form.categoryId,
          isAvailable: form.isAvailable
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to save menu")
      }

      setDialogVisible(false)
      setForm({
        id: "",
        name: "",
        price: "",
        imageUrl: "",
        categoryId: "",
        isAvailable: true
      })
      
      toast.success(isEdit ? "Perubahan disimpan" : "Menu ditambahkan")
      fetchMenus()
    } catch (error) {
      console.error("Error saving menu:", error)
      toast.error("Gagal menyimpan menu")
    } finally {
      setLoading(false)
      loader.done()
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Hapus menu ini?")
    if (!confirmed) return

    try {
      setLoading(true)
      loader.start()

      const res = await authFetch(`/api/menu/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to delete menu")
      }

      toast.success("Menu dihapus")
      fetchMenus()
    } catch (error) {
      console.error("Error deleting menu:", error)
      toast.error("Gagal menghapus menu")
    } finally {
      setLoading(false)
      loader.done()
    }
  }

  const openDialog = (menu?: MenuItem) => {
    setForm({
      id: menu?.id || "",
      name: menu?.name || "",
      price: menu?.price.toString() || "",
      imageUrl: menu?.imageUrl || "",
      categoryId: menu?.categoryId || "",
      isAvailable: menu?.isAvailable || true
    })
    setDialogVisible(true)
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || "-"
  }

  useEffect(() => {
    fetchMenus()
    fetchCategories()
  }, [])

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Gambar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {menus.map(menu => (
            <TableRow key={menu.id}>
              <TableCell>
                { /* eslint-disable-next-line @next/next/no-img-element */ }
                <img
                  src={menu.imageUrl || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png"}
                  alt={menu.name}
                  className="h-12 w-12 rounded object-cover"
                />
              </TableCell>
              <TableCell>{menu.name}</TableCell>
              <TableCell>Rp {menu.price.toLocaleString("id-ID")}</TableCell>
              <TableCell>{getCategoryName(menu.categoryId)}</TableCell>
              <TableCell>
                {menu.isAvailable ? (
                  <span className="text-green-500">Tersedia</span>
                ) : (
                  <span className="text-red-500">Tidak Tersedia</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => openDialog(menu)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(menu.id)}>
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="absolute bottom-4 right-4">
        <Button size="icon" onClick={() => openDialog()} disabled={loading} className="size-12">
          <Plus className="size-5" />
        </Button>
      </div>
      <Dialog open={dialogVisible} onOpenChange={setDialogVisible}>
        <DialogContent>
          <DialogTitle>{form.id ? "Edit" : "Tambah"} Menu</DialogTitle>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              placeholder="Nama menu"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              placeholder="Harga"
              type="number"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              required
            />
            <Input
              placeholder="URL gambar (opsional)"
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            />
            <Select
              value={form.categoryId}
              onValueChange={val => setForm({ ...form, categoryId: val })}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={form.isAvailable}
                onCheckedChange={val => setForm({ ...form, isAvailable: val })}
              />
              <Label htmlFor="isAvailable">{form.isAvailable ? "Tersedia" : "Tidak Tersedia"}</Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {form.id ? "Simpan Perubahan" : "Tambah Menu"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ManageMenu
