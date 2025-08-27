import { useEffect, useMemo, useState } from "react";
import tenantCourses from "@/data/tenant_courses.json";
import users from "@/data/users.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function TenantAdminCourses() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ id: "", title: "", status: "draft" });
  const [editingId, setEditingId] = useState<string | null>(null);

  // seed from dummy JSON once
  useEffect(() => {
    try {
      const current = (users as any[])[0] as any;
      const slug = current?.tenantSlug || "acme";
      const all = tenantCourses as any[];
      const entry = Array.isArray(all) ? all.find((t: any) => t.tenantId === slug) : null;
      const seed = entry?.courses ?? (Array.isArray(all) ? all.flatMap((t: any) => t?.courses ?? []) : []);
      setItems(seed);
    } catch {
      const all = tenantCourses as any[];
      setItems(Array.isArray(all) ? all.flatMap((t: any) => t?.courses ?? []) : []);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((c) => c.title.toLowerCase().includes(q));
  }, [items, query]);

  const resetForm = () => {
    setForm({ id: "", title: "", status: "draft" });
    setEditingId(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (editingId) {
      setItems((prev) => prev.map((it) => (it.id === editingId ? { ...it, ...form, id: editingId } : it)));
    } else {
      const id = `tc-${Date.now()}`;
      setItems((prev) => [{ id, thumbnail: "https://placehold.co/600x400?text=Course", ...form }, ...prev]);
    }
    resetForm();
  };

  const onEdit = (id: string) => {
    const it = items.find((i) => i.id === id);
    if (!it) return;
    setForm({ id: it.id, title: it.title, status: it.status || "draft" });
    setEditingId(id);
  };

  const onDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tenant Admin · Courses</h1>
        <p className="text-muted-foreground text-sm">Kelola kursus (dummy CRUD)</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editingId ? "Edit Course" : "Add Course"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input placeholder="Course title" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} />
            <select
              value={form.status}
              onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <Button type="submit" className="md:col-span-1 col-span-1">
              <Plus className="h-4 w-4 mr-2" /> {editingId ? "Update" : "Add"}
            </Button>
            <Input className="md:col-span-1" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>{c.title}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{c.status || "draft"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <img src={c.thumbnail} alt={c.title} className="w-full h-32 object-cover rounded-md mb-3" />
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => onEdit(c.id)}>
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(c.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
