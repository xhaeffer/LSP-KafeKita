"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { useTopLoader } from "nextjs-toploader"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { authFetch } from "@/lib/authFetch"

import { MenuCategory } from "@/types/menuCategories"

export default function ManageMenuCategories() {
  const loader = useTopLoader()

  const [loading, setLoading] = useState(false)
  const [isDialogVisible, setDialogVisible] = useState(false)

  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [editId, setEditId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const fetchCategories = async () => {
    try {
      loader.start()

      const res = await fetch("/api/menu-categories")
      if (!res.ok) {
        throw new Error("Failed to fetch categories")
      }

      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Gagal memuat kategori")
    } finally {
      loader.done()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isEditing = Boolean(editId)
    const payload = { name, imageUrl: imageUrl || undefined }

    try {
      setLoading(true)
      loader.start()

      const url = isEditing 
        ? `/api/menu-categories/${editId}` 
        : "/api/menu-categories"
      const method = isEditing ? "PATCH" : "POST"

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to save category")
      }

      toast.success(isEditing ? "Kategori diperbarui" : "Kategori ditambahkan")

      setName("")
      setImageUrl("")
      setEditId(null)
      setDialogVisible(false)
      
      fetchCategories()
    } catch (error) {
      console.error("Error saving category:", error)
      toast.error(isEditing ? "Gagal memperbarui kategori" : "Gagal menambahkan kategori")
    } finally {
      setLoading(false)
      loader.done()
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Hapus kategori ini?")
    if (!confirmed) return

    try {
      setLoading(true)  
      loader.start()

      const res = await authFetch(`/api/menu-categories/${id}`, { method: "DELETE" })
      if (!res.ok) {
        throw new Error("Failed to delete category")
      }

      toast.success("Kategori dihapus")
      fetchCategories()
    } catch (error) {
      console.error("Error deleting category:", error)                         
      toast.error("Gagal menghapus kategori")
    } finally {
      setLoading(false)
      loader.done()
    }
  }

  const openDialog = (category?: MenuCategory) => {
    setDialogVisible(true)
    setEditId(category?.id || null)
    setName(category?.name  || "" )
    setImageUrl(category?.imageUrl || "")
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Gambar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(cat => (
            <TableRow key={cat.id}>
              <TableCell>
                { /* eslint-disable-next-line @next/next/no-img-element */ }
                <img
                  src={cat.imageUrl || "https://static-00.iconduck.com/assets.00/no-image-icon-512x512-lfoanl0w.png"}
                  alt={cat.name}
                  className="h-12 w-12 rounded object-cover"
                />
              </TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => openDialog(cat)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(cat.id)}>
                    <Trash2 className="w-4 h-4" />
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
      <Dialog open={isDialogVisible} onOpenChange={setDialogVisible}>
        <DialogContent>
          <DialogTitle>{editId ? "Update" : "Tambah"} Kategori</DialogTitle>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              placeholder="Nama kategori"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              placeholder="URL gambar (opsional)"
              value={imageUrl}
              type="url"
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {editId ? "Update" : "Tambah"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
