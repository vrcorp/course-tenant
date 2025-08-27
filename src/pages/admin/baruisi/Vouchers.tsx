import { useEffect, useMemo, useState } from "react";
import seed from "@/data/vouchers.json";
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

interface Voucher { code: string; type: "percent" | "amount"; value: number; active: boolean }

export default function AdminVouchers() {
  const [items, setItems] = useState<Voucher[]>([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState<Voucher>({ code: "", type: "percent", value: 10, active: true });
  const [editing, setEditing] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seedNorm = (seed as any[]).map((v: any) => ({
      code: v.code,
      type: (v.type === "fixed" ? "amount" : v.type) as "percent" | "amount",
      value: Number(v.value) || 0,
      active: v.active !== false,
    })) as Voucher[];
    const initial = loadArray<Voucher>(STORE_KEYS.vouchers, seedNorm);
    setItems(initial);
  }, []);

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return items.filter(i => `${i.code}`.toLowerCase().includes(t));
  }, [items, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => setPage(1), [q, items.length]);

  const resetForm = () => setForm({ code: "", type: "percent", value: 10, active: true });

  const startAdd = () => { setEditing(null); resetForm(); setOpen(true); };
  const startEdit = (code: string) => {
    const it = items.find(i => i.code === code);
    if (it) { setForm({ ...it }); setEditing(code); setOpen(true); }
  };
  const save = () => {
    if (!form.code) {
      toast({ variant: "destructive", title: "Missing code", description: "Voucher code is required." });
      return;
    }
    if (form.value <= 0) {
      toast({ variant: "destructive", title: "Invalid value", description: "Value must be greater than zero." });
      return;
    }
    if (editing) {
      const next = items.map(i => i.code === editing ? { ...form } : i);
      setItems(next);
      saveArray(STORE_KEYS.vouchers, next);
      toast({ title: "Voucher updated", description: `${form.code} saved.` });
    } else {
      if (items.some(i => i.code === form.code)) {
        toast({ variant: "destructive", title: "Duplicate code", description: "Please use a unique voucher code." });
        return;
      }
      const next = [{ ...form }, ...items];
      setItems(next);
      saveArray(STORE_KEYS.vouchers, next);
      toast({ title: "Voucher added", description: `${form.code} created.` });
    }
    setEditing(null);
    resetForm();
    setOpen(false);
  };
  const remove = (code: string) => {
    const next = items.filter(i => i.code !== code);
    setItems(next);
    saveArray(STORE_KEYS.vouchers, next);
    toast({ title: "Voucher removed", description: `${code} deleted.` });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Voucher Management</h1>
        <p className="text-muted-foreground mt-2">Manage all discount vouchers</p>
      </div>

      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Vouchers</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  placeholder="Search vouchers..." 
                  className="w-full md:w-64 pl-10 rounded-lg bg-white" 
                />
              </div>
              <Button onClick={startAdd} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2"/>Add Voucher
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditing(null); resetForm(); } }}>
            <DialogContent className="sm:max-w-[650px] rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">{editing ? "Edit Voucher" : "Add Voucher"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="vcode">Code</Label>
                  <Input id="vcode" placeholder="CODE10" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percent</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vval">Value</Label>
                  <Input id="vval" type="number" placeholder="10" value={form.value} onChange={e => setForm({ ...form, value: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={String(form.active)} onValueChange={(v) => setForm({ ...form, active: v === 'true' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setEditing(null); resetForm(); setOpen(false); }}>
                  <X className="h-4 w-4 mr-2"/>Cancel
                </Button>
                <Button onClick={save} className="bg-blue-600 hover:bg-blue-700"><Save className="h-4 w-4 mr-2"/>{editing ? "Save Changes" : "Create Voucher"}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="text-center p-10">
                <div className="text-gray-400 mb-2">No vouchers found</div>
                <p className="text-sm text-gray-500">Try adjusting your search or add a new voucher</p>
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500 font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Value</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.map(v => (
                  <tr key={v.code} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-900">{v.code}</td>
                    <td className="px-6 py-4 capitalize">{v.type}</td>
                    <td className="px-6 py-4">{v.type === 'percent' ? `${v.value}%` : `Rp ${v.value.toLocaleString()}`}</td>
                    <td className="px-6 py-4">{v.active ? <Badge>Active</Badge> : <Badge variant="outline">Inactive</Badge>}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => startEdit(v.code)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4"/>
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => remove(v.code)}
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
