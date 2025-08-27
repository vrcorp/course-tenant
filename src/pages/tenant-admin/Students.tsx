import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Student { id: string; name: string; email: string; status: "active" | "suspended"; }

const seed: Student[] = [
  { id: "st-1", name: "Rina Saputri", email: "rina@example.com", status: "active" },
  { id: "st-2", name: "Budi Hartono", email: "budi@example.com", status: "active" },
  { id: "st-3", name: "Yoga Prabowo", email: "yoga@example.com", status: "suspended" },
];

export default function TenantAdminStudents() {
  const [items, setItems] = useState<Student[]>(seed);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", status: "active" as Student["status"] });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }, [items, query]);

  const resetForm = () => { setForm({ name: "", email: "", status: "active" }); setEditingId(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    if (editingId) {
      setItems(prev => prev.map(s => s.id === editingId ? { ...s, ...form } as Student : s));
    } else {
      const id = `st-${Date.now()}`;
      setItems(prev => [{ id, ...form }, ...prev]);
    }
    resetForm();
  };

  const onEdit = (id: string) => {
    const s = items.find(i => i.id === id); if (!s) return;
    setEditingId(id); setForm({ name: s.name, email: s.email, status: s.status });
  };
  const onDelete = (id: string) => { setItems(prev => prev.filter(i => i.id !== id)); if (editingId === id) resetForm(); };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tenant Admin · Students</h1>
        <p className="text-muted-foreground text-sm">Kelola siswa (dummy CRUD)</p>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>{editingId ? "Edit Student" : "Add Student"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))} />
            <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm(s => ({ ...s, email: e.target.value }))} />
            <select value={form.status} onChange={(e) => setForm(s => ({ ...s, status: e.target.value as Student["status"] }))} className="h-10 px-3 rounded-md border border-input bg-background text-sm">
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
            <Input className="md:col-span-1" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button type="submit"><Plus className="h-4 w-4 mr-2" /> {editingId ? "Update" : "Add"}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>{s.name}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{s.status}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">{s.email}</div>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => onEdit(s.id)}><Pencil className="h-4 w-4 mr-1" /> Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(s.id)}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
