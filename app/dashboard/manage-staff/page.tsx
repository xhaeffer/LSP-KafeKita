"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useTopLoader } from "nextjs-toploader"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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

import { authFetch } from "@/lib/authFetch"

import { Staff, StaffRole } from "@/types/staff"

const ManageStaff = () => {
  const loader = useTopLoader()
  
  const [loading, setLoading] = useState(false)
  const [isDialogVisible, setDialogVisible] = useState(false)

  const [staffs, setStaffs] = useState<Staff[]>([])
  const [form, setForm] = useState<{
    id?: string;
    displayName: string;
    email: string;
    role: StaffRole | "";
    password?: string
    disabled?: boolean;
  }>({
    displayName: "",
    email: "",
    role: "",
  })


  const fetchStaffs = async () => {
    try {
      setLoading(true)
      loader.start()

      const res = await authFetch("/api/staffs")
      if (!res.ok) {
        throw new Error("Failed to fetch staffs")
      }

      const data = await res.json()
      setStaffs(data)
    } catch (error) {
      console.error("Error fetching staffs:", error)
      toast.error("Gagal memuat data staff")
    } finally {
      setLoading(false)
      loader.done()
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      loader.start()

      const isEdit = Boolean(form.id)
      const url = isEdit 
        ? `/api/staffs/${form.id}`
        : "/api/staffs"
      const method = isEdit ? "PATCH" : "POST"

      const res = await authFetch(url, {
        method,
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to save staff")
      }

      setDialogVisible(false)
      setForm({
        id: "",
        displayName: "",
        email: "",
        role: "",
        password: "",
        disabled: false,
      })

      toast.success("Data berhasil disimpan.")
      fetchStaffs()
    } catch (error) {
      console.error("Error saving staff:", error)
      toast.error("Gagal menyimpan data staff.")
    } finally {
      setLoading(false)
      loader.done()
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = confirm("Hapus staff ini?")
    if (!confirmed) return

    try {
      setLoading(true)
      loader.start()

      const res = await authFetch(`/api/staffs/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to delete staff")
      }

      toast.success("Berhasil dihapus.")
      fetchStaffs()
    } catch (error) {
      console.error("Error deleting staff:", error)
      toast.error("Gagal menghapus staff.")
    } finally {
      setLoading(false)
      loader.done()
    }
  }

  const openDialog = (staff?: Staff) => {
    setForm({ 
      id: staff?.id || "",
      displayName: staff?.displayName || "",
      email: staff?.email || "",
      role: staff?.role || "",
      disabled: staff?.disabled  || false,
    })
    setDialogVisible(true)
  }

  useEffect(() => {
    fetchStaffs()
  }, [])

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staffs.map(staff => (
            <TableRow key={staff.id}>
              <TableCell>{staff.displayName}</TableCell>
              <TableCell>{staff.email}</TableCell>
              <TableCell>{staff.role}</TableCell>
              <TableCell>
                {staff.disabled ? (
                  <span className="text-red-500">Nonaktif</span>
                ) : (
                  <span className="text-green-500">Aktif</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDialog(staff)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(staff.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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
          <DialogTitle>{form.id ? "Edit" : "Tambah"} Staff</DialogTitle>
          <div className="space-y-4">
            <Input
              placeholder="Nama"
              value={form.displayName}
              onChange={e => setForm({ ...form, displayName: e.target.value })}
              required
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
            {!form.id && (
              <Input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
            )}
            <Select
              value={form.role}
              onValueChange={(val) => setForm({ ...form, role: val as StaffRole })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih role"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="cashier">Cashier</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch 
                id="status" 
                checked={!form.disabled}
                onCheckedChange={(val) => setForm({...form, disabled: !val})}
              />
              <Label htmlFor="status">{!form.disabled ? "Aktif" : "Nonaktif"}</Label>
            </div>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="w-full">{form.id ? "Simpan Perubahan" : "Tambah Staff"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ManageStaff
