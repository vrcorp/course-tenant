import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function TenantAdminQuizzes() {
  type Quiz = { id: string; title: string; questions: number; status: "draft" | "published" };
  const seed: Quiz[] = [
    { id: "qz-1", title: "UI Basics", questions: 10, status: "published" },
    { id: "qz-2", title: "Node.js Intro", questions: 8, status: "draft" },
  ];

  const [items, setItems] = useState<Quiz[]>(seed);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", questions: 5, status: "draft" as Quiz["status"] });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((k) => k.title.toLowerCase().includes(q));
  }, [items, query]);

  const resetForm = () => { setForm({ title: "", questions: 5, status: "draft" }); setEditingId(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingId) {
      setItems(prev => prev.map(k => k.id === editingId ? { ...k, ...form } as Quiz : k));
    } else {
      const id = `qz-${Date.now()}`;
      setItems(prev => [{ id, ...form }, ...prev]);
    }
    resetForm();
  };

  const onEdit = (id: string) => {
    const k = items.find(i => i.id === id); if (!k) return;
    setEditingId(id); setForm({ title: k.title, questions: k.questions, status: k.status });
  };
  const onDelete = (id: string) => { setItems(prev => prev.filter(i => i.id !== id)); if (editingId === id) resetForm(); };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Tenant Admin · Quizzes</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle>{editingId ? "Edit Quiz" : "Add Quiz"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm(s => ({ ...s, title: e.target.value }))} />
            <Input type="number" min={1} placeholder="Questions" value={form.questions} onChange={(e) => setForm(s => ({ ...s, questions: Number(e.target.value) }))} />
            <select value={form.status} onChange={(e) => setForm(s => ({ ...s, status: e.target.value as Quiz["status"] }))} className="h-10 px-3 rounded-md border border-input bg-background text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
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
              <div className="text-sm text-muted-foreground">Questions: {k.questions}</div>
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
