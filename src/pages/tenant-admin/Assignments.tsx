import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function TenantAdminAssignments() {
  type Assignment = { id: string; title: string; dueDate: string; status: "open" | "closed" };
  const seed: Assignment[] = [
    { id: "as-1", title: "Landing Page Wireframe", dueDate: new Date(Date.now() + 3*86400000).toISOString().slice(0,10), status: "open" },
    { id: "as-2", title: "REST API Spec", dueDate: new Date(Date.now() + 5*86400000).toISOString().slice(0,10), status: "open" },
  ];

  const [items, setItems] = useState<Assignment[]>(seed);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", dueDate: new Date().toISOString().slice(0,10), status: "open" as Assignment["status"] });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((k) => k.title.toLowerCase().includes(q));
  }, [items, query]);

  const resetForm = () => { setForm({ title: "", dueDate: new Date().toISOString().slice(0,10), status: "open" }); setEditingId(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingId) {
      setItems(prev => prev.map(k => k.id === editingId ? { ...k, ...form } as Assignment : k));
    } else {
      const id = `as-${Date.now()}`;
      setItems(prev => [{ id, ...form }, ...prev]);
    }
    resetForm();
  };

  const onEdit = (id: string) => {
    const k = items.find(i => i.id === id); if (!k) return;
    setEditingId(id); setForm({ title: k.title, dueDate: k.dueDate, status: k.status });
  };
  const onDelete = (id: string) => { setItems(prev => prev.filter(i => i.id !== id)); if (editingId === id) resetForm(); };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Tenant Admin · Assignments</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle>{editingId ? "Edit Assignment" : "Add Assignment"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm(s => ({ ...s, title: e.target.value }))} />
            <input type="date" className="h-10 px-3 rounded-md border border-input bg-background text-sm" value={form.dueDate} onChange={(e) => setForm(s => ({ ...s, dueDate: e.target.value }))} />
            <select value={form.status} onChange={(e) => setForm(s => ({ ...s, status: e.target.value as Assignment["status"] }))} className="h-10 px-3 rounded-md border border-input bg-background text-sm">
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <Input className="md:col-span-1" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button type="submit"><Plus className="h-4 w-4 mr-2" /> {editingId ? "Update" : "Add"}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((k) => (
          <Card key={k.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>{k.title}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{k.status}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Due: {new Date(k.dueDate).toLocaleDateString()}</div>
              <div className="mt-3 flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => onEdit(k.id)}><Pencil className="h-4 w-4 mr-1" /> Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(k.id)}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
