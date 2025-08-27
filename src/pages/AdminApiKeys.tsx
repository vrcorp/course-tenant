import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Search } from "lucide-react";
import seed from "@/data/admin_api_keys.json";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function AdminApiKeys() {
  type ApiKey = { id: string; name: string; key: string; active: boolean; createdAt: string };
  const [items, setItems] = useState<ApiKey[]>([]);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ApiKey>({ id: "", name: "", key: "", active: true, createdAt: new Date().toISOString() });
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const initial = loadArray<ApiKey>(STORE_KEYS.apiKeys, seed as any[]);
    setItems(initial);
  }, []);

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return items.filter(i => `${i.id} ${i.name} ${i.key}`.toLowerCase().includes(t));
  }, [items, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => { setPage(1); }, [q, items.length]);

  const resetForm = () => setForm({ id: "", name: "", key: "", active: true, createdAt: new Date().toISOString() });
  const startAdd = () => { setEditing(null); resetForm(); setOpen(true); };
  const startEdit = (id: string) => {
    const it = items.find(i => i.id === id);
    if (it) { setForm({ ...it }); setEditing(id); setOpen(true); }
  };
  const remove = (id: string) => {
    const it = items.find(i => i.id === id);
    const next = items.filter(i => i.id !== id);
    setItems(next);
    saveArray(STORE_KEYS.apiKeys, next);
    toast({ title: "API key removed", description: `${it?.name || id} deleted.` });
  };
  const save = () => {
    if (!form.id || !form.name || !form.key) {
      toast({ variant: "destructive", title: "Missing fields", description: "ID, Name and Key are required." });
      return;
    }
    if (editing) {
      const next = items.map(i => i.id === editing ? { ...form } : i);
      setItems(next);
      saveArray(STORE_KEYS.apiKeys, next);
      toast({ title: "API key updated", description: `${form.name} saved.` });
    } else {
      if (items.some(i => i.id === form.id)) {
        toast({ variant: "destructive", title: "Duplicate ID", description: "Please use a unique ID." });
        return;
      }
      const next = [{ ...form }, ...items];
      setItems(next);
      saveArray(STORE_KEYS.apiKeys, next);
      toast({ title: "API key added", description: `${form.name} created.` });
    }
    setEditing(null);
    resetForm();
    setOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin - API Keys</h1>
        <p className="text-muted-foreground mt-2">Manage API keys</p>
      </div>

      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800">API Keys</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search keys..." className="w-full md:w-64 pl-10 rounded-lg bg-white" />
              </div>
              <Button onClick={startAdd} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2"/>Add Key
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); resetForm(); } }}>
            <DialogContent className="sm:max-w-xl rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{editing ? "Edit API Key" : "Add API Key"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="kid">ID</Label>
                  <Input id="kid" placeholder="key-1" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kname">Name</Label>
                  <Input id="kname" placeholder="Webhook Key" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="kval">Key</Label>
                  <Input id="kval" placeholder="xxxxxxxx" value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kactive">Active</Label>
                  <div className="flex items-center gap-2 text-sm">
                    <input id="kactive" type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Active
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kcreated">Created At</Label>
                  <Input id="kcreated" type="datetime-local" value={new Date(form.createdAt).toISOString().slice(0,16)} onChange={e => setForm({ ...form, createdAt: new Date(e.target.value).toISOString() })} />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2"/>{editing ? "Save Changes" : "Create Key"}
                </Button>
                <Button variant="outline" onClick={() => { setEditing(null); resetForm(); setOpen(false); }}>
                  <X className="h-4 w-4 mr-2"/>Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="text-center p-10">
                <div className="text-gray-400 mb-2">No API keys found</div>
                <p className="text-sm text-gray-500">Try adjusting your search or add a new API key</p>
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500 font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Key</th>
                  <th className="px-6 py-4">Active</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.map(k => (
                  <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{k.id}</td>
                    <td className="px-6 py-4">{k.name}</td>
                    <td className="px-6 py-4 font-mono text-xs break-all">{k.key}</td>
                    <td className="px-6 py-4">{k.active ? <Badge className="bg-green-600 hover:bg-green-600">Active</Badge> : <Badge variant="outline">Disabled</Badge>}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(k.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(k.id)} className="h-8 w-8 p-0">
                          <Pencil className="h-4 w-4"/>
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(k.id)} className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4"/>
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
            {filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t">
                <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to {""}
                  <span className="font-medium">{Math.min(page * pageSize, filtered.length)}</span> of {""}
                  <span className="font-medium">{filtered.length}</span>
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="flex items-center gap-1">
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pn => (
                      <Button key={pn} size="sm" variant={page === pn ? "default" : "outline"} onClick={() => setPage(pn)} className="h-8 w-8 p-0">{pn}</Button>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="flex items-center gap-1">
                    Next
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
