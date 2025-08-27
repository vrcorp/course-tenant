import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Search, ChevronLeft, ChevronRight } from "lucide-react";
import seed from "@/data/tenants.json";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminTenants() {
  type Tenant = {
    id: string;
    name: string;
    slug: string;
    domain: { type: "subdomain" | "custom"; value: string };
    packageId?: string;
    quotas?: { students?: number; courses?: number };
  };

  const [items, setItems] = useState<Tenant[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Tenant>({
    id: "",
    name: "",
    slug: "",
    domain: { type: "subdomain", value: "" },
    packageId: "",
    quotas: { students: 100, courses: 10 },
  });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const initial = loadArray<Tenant>(STORE_KEYS.tenants, seed as any[]);
    setItems(initial);
  }, []);

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return items.filter(i => `${i.id} ${i.name} ${i.slug} ${i.domain.value}`.toLowerCase().includes(t));
  }, [items, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => { setPage(1); }, [q, items.length]);

  const resetForm = () => setForm({ id: "", name: "", slug: "", domain: { type: "subdomain", value: "" }, packageId: "", quotas: { students: 100, courses: 10 } });
  const startAdd = () => { setEditing(null); resetForm(); setOpen(true); };
  const startEdit = (id: string) => {
    const it = items.find(i => i.id === id);
    if (it) { setForm(JSON.parse(JSON.stringify(it))); setEditing(id); setOpen(true); }
  };
  const remove = (id: string) => {
    const it = items.find(i => i.id === id);
    const next = items.filter(i => i.id !== id);
    setItems(next);
    saveArray(STORE_KEYS.tenants, next);
    toast({ title: "Tenant removed", description: `${it?.name || id} deleted.` });
  };
  const save = () => {
    if (!form.id || !form.name || !form.slug) {
      toast({ variant: "destructive", title: "Missing fields", description: "ID, Name, and Slug are required." });
      return;
    }
    if (!/^[-a-z0-9]+$/.test(form.slug)) {
      toast({ variant: "destructive", title: "Invalid slug", description: "Slug must be lowercase letters, numbers, and dashes." });
      return;
    }
    if (!form.domain?.value) {
      toast({ variant: "destructive", title: "Domain required", description: "Please enter domain/subdomain value." });
      return;
    }
    if (editing) {
      const next = items.map(i => i.id === editing ? { ...form } : i);
      setItems(next);
      saveArray(STORE_KEYS.tenants, next);
      toast({ title: "Tenant updated", description: `${form.name} saved.` });
    } else {
      if (items.some(i => i.id === form.id)) {
        toast({ variant: "destructive", title: "Duplicate ID", description: "Please use a unique ID." });
        return;
      }
      const next = [{ ...form }, ...items];
      setItems(next);
      saveArray(STORE_KEYS.tenants, next);
      toast({ title: "Tenant added", description: `${form.name} created.` });
    }
    setEditing(null);
    resetForm();
    setOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tenant Management</h1>
        <p className="text-muted-foreground mt-2">Manage all tenants in the system</p>
      </div>

      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Tenants</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  placeholder="Search tenants..." 
                  className="w-full md:w-64 pl-10 rounded-lg bg-white" 
                />
              </div>
              <Button onClick={startAdd} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2"/>Add Tenant
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="text-center p-10">
                <div className="text-gray-400 mb-2">No tenants found</div>
                <p className="text-sm text-gray-500">Try adjusting your search or add a new tenant</p>
              </div>
            ) : (
            <>
              {/* Mobile cards */}
              <div className="md:hidden p-4 space-y-4">
                {paginated.map(t => (
                  <div key={t.id} className="rounded-xl border bg-white shadow-sm p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-500">Tenant ID</div>
                        <div className="text-base font-semibold text-gray-900">{t.id}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => startEdit(t.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4"/>
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => remove(t.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4"/>
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="text-base text-gray-900">{t.name}</div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-gray-500">Slug</div>
                      <div className="mt-1">
                        <Badge variant="outline" className="font-mono">{t.slug}</Badge>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-gray-500">Domain</div>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant={t.domain.type === "subdomain" ? "secondary" : "outline"} className="text-xs">
                          {t.domain.type}
                        </Badge>
                        <span className="text-sm text-gray-900">{t.domain.value}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-gray-500">Package</div>
                      <div className="mt-1">
                        {t.packageId ? (
                          <Badge variant="outline">{t.packageId}</Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">None</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm text-gray-500">Quotas</div>
                      <div className="mt-1 text-sm text-gray-900">
                        <div>{t.quotas?.students || 0} students</div>
                        <div>{t.quotas?.courses || 0} courses</div>
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
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4">Domain</th>
                    <th className="px-6 py-4">Package</th>
                    <th className="px-6 py-4">Quotas</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginated.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{t.id}</td>
                      <td className="px-6 py-4">{t.name}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="font-mono">{t.slug}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Badge variant={t.domain.type === "subdomain" ? "secondary" : "outline"} className="text-xs">
                            {t.domain.type}
                          </Badge>
                          <span className="text-sm">{t.domain.value}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {t.packageId ? (
                          <Badge variant="outline">{t.packageId}</Badge>
                        ) : (
                          <span className="text-gray-400 text-sm">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm">
                          <span>{t.quotas?.students || 0} students</span>
                          <span>{t.quotas?.courses || 0} courses</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => startEdit(t.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4"/>
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => remove(t.id)}
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[650px] rounded-xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editing ? "Edit Tenant" : "Add New Tenant"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID *</Label>
              <Input 
                id="id"
                placeholder="Unique identifier" 
                value={form.id} 
                onChange={e => setForm({ ...form, id: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input 
                id="name"
                placeholder="Display name" 
                value={form.name} 
                onChange={e => setForm({ ...form, name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input 
                id="slug"
                placeholder="URL-friendly identifier" 
                value={form.slug} 
                onChange={e => setForm({ ...form, slug: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Domain Configuration *</Label>
              <div className="flex gap-2">
                <Select
                  value={form.domain.type}
                  onValueChange={(value: "subdomain" | "custom") => 
                    setForm({ ...form, domain: { ...form.domain, type: value } })
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="subdomain">Subdomain</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder={form.domain.type === "subdomain" ? "subdomain.example.com" : "example.com"} 
                  value={form.domain.value} 
                  onChange={e => setForm({ ...form, domain: { ...form.domain, value: e.target.value } })} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="package">Package ID</Label>
              <Input 
                id="package"
                placeholder="Optional package identifier" 
                value={form.packageId} 
                onChange={e => setForm({ ...form, packageId: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Quotas</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="students" className="text-xs">Students</Label>
                  <Input 
                    id="students"
                    type="number" 
                    placeholder="Student quota" 
                    value={form.quotas?.students ?? 0} 
                    onChange={e => setForm({ ...form, quotas: { ...form.quotas, students: Number(e.target.value) } })} 
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="courses" className="text-xs">Courses</Label>
                  <Input 
                    id="courses"
                    type="number" 
                    placeholder="Course quota" 
                    value={form.quotas?.courses ?? 0} 
                    onChange={e => setForm({ ...form, quotas: { ...form.quotas, courses: Number(e.target.value) } })} 
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); setEditing(null); resetForm(); }}>
              <X className="h-4 w-4 mr-2"/>Cancel
            </Button>
            <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2"/>{editing ? "Save Changes" : "Create Tenant"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}