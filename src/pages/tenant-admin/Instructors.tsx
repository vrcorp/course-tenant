import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function TenantAdminInstructors() {
  type Instructor = { id: string; name: string; expertise: string; status: "active" | "inactive" };
  const seed: Instructor[] = [
    { id: "ins-1", name: "Dewi Kusuma", expertise: "UI/UX", status: "active" },
    { id: "ins-2", name: "Agus Salim", expertise: "Backend", status: "inactive" },
  ];

  const [items, setItems] = useState<Instructor[]>(seed);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", expertise: "", status: "active" as Instructor["status"] });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((i) => i.name.toLowerCase().includes(q) || i.expertise.toLowerCase().includes(q));
  }, [items, query]);

  const resetForm = () => { setForm({ name: "", expertise: "", status: "active" }); setEditingId(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) {
      setItems(prev => prev.map(i => i.id === editingId ? { ...i, ...form } as Instructor : i));
    } else {
      const id = `ins-${Date.now()}`;
      setItems(prev => [{ id, ...form }, ...prev]);
    }
    resetForm();
  };

  const onEdit = (id: string) => {
    const it = items.find(i => i.id === id); if (!it) return;
    setEditingId(id); setForm({ name: it.name, expertise: it.expertise, status: it.status });
  };
  const onDelete = (id: string) => { setItems(prev => prev.filter(i => i.id !== id)); if (editingId === id) resetForm(); };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tenant Admin · Instructors</h1>
        <p className="text-muted-foreground text-sm">Kelola instruktur (dummy CRUD)</p>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle>{editingId ? "Edit Instructor" : "Add Instructor"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm(s => ({ ...s, name: e.target.value }))} />
            <Input placeholder="Expertise" value={form.expertise} onChange={(e) => setForm(s => ({ ...s, expertise: e.target.value }))} />
            <select value={form.status} onChange={(e) => setForm(s => ({ ...s, status: e.target.value as Instructor["status"] }))} className="h-10 px-3 rounded-md border border-input bg-background text-sm">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Input className="md:col-span-1" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button type="submit"><Plus className="h-4 w-4 mr-2" /> {editingId ? "Update" : "Add"}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((ins) => (
          <Card key={ins.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>{ins.name}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{ins.status}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Expertise: {ins.expertise}</div>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => onEdit(ins.id)}><Pencil className="h-4 w-4 mr-1" /> Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(ins.id)}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
