import { useEffect, useMemo, useState } from "react";
import seed from "@/data/users.json";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Save, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserRow { id: string; name: string; email: string; role: "user" | "admin" | "super_admin" | "affiliator"; hasLmsTenant?: boolean; tenantSlug?: string | null; hasVideoHosting?: boolean }

export default function AdminUsers() {
  const [items, setItems] = useState<UserRow[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<UserRow>({ id: "", name: "", email: "", role: "user", hasLmsTenant: false, tenantSlug: null, hasVideoHosting: false });
  const [editing, setEditing] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seedNorm: UserRow[] = (seed as any[]).map((u: any) => ({
      id: String(u.id || u.userId || ""),
      name: u.name || u.fullName || "",
      email: u.email || "",
      role: (u.role || "user") as any,
      hasLmsTenant: Boolean(u.hasLmsTenant),
      tenantSlug: u.tenantSlug ?? null,
      hasVideoHosting: Boolean(u.hasVideoHosting),
    }));
    const initial = loadArray<UserRow>(STORE_KEYS.users, seedNorm);
    setItems(initial);
  }, []);

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return items.filter(i => `${i.id} ${i.name} ${i.email}`.toLowerCase().includes(t));
  }, [items, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => setPage(1), [q, items.length]);

  const resetForm = () => setForm({ id: "", name: "", email: "", role: "user", hasLmsTenant: false, tenantSlug: null, hasVideoHosting: false });

  const startAdd = () => { setEditing(null); resetForm(); setOpen(true); };
  const startEdit = (id: string) => {
    const it = items.find(i => i.id === id);
    if (it) { setForm({ ...it }); setEditing(id); setOpen(true); }
  };
  const save = () => {
    if (!form.id || !form.name || !form.email) {
      toast({ variant: "destructive", title: "Missing fields", description: "ID, Name and Email are required." });
      return;
    }
    if (!form.email.includes("@")) {
      toast({ variant: "destructive", title: "Invalid email", description: "Please enter a valid email." });
      return;
    }
    if (editing) {
      const next = items.map(i => i.id === editing ? { ...form } : i);
      setItems(next);
      saveArray(STORE_KEYS.users, next);
      toast({ title: "User updated", description: `${form.name} saved.` });
    } else {
      if (items.some(i => i.id === form.id)) {
        toast({ variant: "destructive", title: "Duplicate ID", description: "Please use a unique user ID." });
        return;
      }
      const next = [{ ...form }, ...items];
      setItems(next);
      saveArray(STORE_KEYS.users, next);
      toast({ title: "User added", description: `${form.name} created.` });
    }
    setEditing(null);
    resetForm();
    setOpen(false);
  };
  const remove = (id: string) => {
    const it = items.find(i => i.id === id);
    const next = items.filter(i => i.id !== id);
    setItems(next);
    saveArray(STORE_KEYS.users, next);
    toast({ title: "User removed", description: `${it?.name || id} deleted.` });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <p className="text-muted-foreground mt-2">Manage all users in the system</p>
      </div>
      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Users</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="Search users..."
                  className="w-full md:w-64 pl-10 rounded-lg bg-white"
                />
              </div>
              <Button onClick={startAdd} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2"/>Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); resetForm(); } }}>
          <DialogContent className="sm:max-w-[650px] rounded-xl max-h-[95vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{editing ? "Edit User" : "Add New User"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="uid">ID *</Label>
                  <Input id="uid" placeholder="ID" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="uname">Name *</Label>
                  <Input id="uname" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="uemail">Email *</Label>
                  <Input id="uemail" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select value={form.role} onValueChange={(v: any) => setForm({ ...form, role: v })}>
                    <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">user</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                      <SelectItem value="super_admin">super_admin</SelectItem>
                      <SelectItem value="affiliator">affiliator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Has LMS Tenant?</Label>
                  <Select value={String(!!form.hasLmsTenant)} onValueChange={(v) => setForm({ ...form, hasLmsTenant: v === 'true' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No Tenant</SelectItem>
                      <SelectItem value="true">Has Tenant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tslug">Tenant Slug</Label>
                  <Input id="tslug" placeholder="tenant-slug" value={form.tenantSlug ?? ''} onChange={e => setForm({ ...form, tenantSlug: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Video Hosting</Label>
                  <Select value={String(!!form.hasVideoHosting)} onValueChange={(v) => setForm({ ...form, hasVideoHosting: v === 'true' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="false">No VH</SelectItem>
                      <SelectItem value="true">Has VH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setOpen(false); setEditing(null); resetForm(); }}>
                  <X className="h-4 w-4 mr-2"/>Cancel
                </Button>
                <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2"/>{editing ? "Save Changes" : "Create User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="text-center p-10">
                <div className="text-gray-400 mb-2">No users found</div>
                <p className="text-sm text-gray-500">Try adjusting your search or add a new user</p>
              </div>
            ) : (
              <>
                {/* Mobile cards */}
                <div className="md:hidden p-4 space-y-4">
                  {paginated.map(u => (
                    <div key={u.id} className="rounded-xl border bg-white shadow-sm p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm text-gray-500">Name</div>
                          <div className="text-base font-semibold text-gray-900">{u.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => startEdit(u.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4"/>
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => remove(u.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4"/>
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-1 gap-3">
                        <div>
                          <div className="text-sm text-gray-500">ID</div>
                          <div className="text-sm font-mono text-gray-900">{u.id}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Email</div>
                          <div className="text-sm text-gray-900 break-all">{u.email}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Role</div>
                          <div className="mt-1">
                            <Badge variant="secondary" className="capitalize">{u.role.replace("_", " ")}</Badge>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Tenant</div>
                          <div className="text-sm text-gray-900">{u.hasLmsTenant ? (u.tenantSlug || '-') : '-'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Video Hosting</div>
                          <div className="mt-1">{u.hasVideoHosting ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <table className="hidden md:table w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-sm text-gray-500 font-medium uppercase tracking-wider">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Tenant</th>
                      <th className="px-6 py-4">VH</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginated.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{u.id}</td>
                        <td className="px-6 py-4">{u.name}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">
                          <Badge variant="secondary" className="capitalize">{u.role.replace("_", " ")}</Badge>
                        </td>
                        <td className="px-6 py-4">{u.hasLmsTenant ? (u.tenantSlug || '-') : '-'}</td>
                        <td className="px-6 py-4">
                          {u.hasVideoHosting ? <Badge>Yes</Badge> : <Badge variant="outline">No</Badge>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => startEdit(u.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4"/>
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => remove(u.id)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4"/>
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t">
                <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * pageSize, filtered.length)}</span> of{" "}
                  <span className="font-medium">{filtered.length}</span> results
                </span>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={page <= 1} 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <Button
                        key={p}
                        size="sm"
                        variant={page === p ? "default" : "outline"}
                        onClick={() => setPage(p)}
                        className="h-8 w-8 p-0"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={page >= totalPages} 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
