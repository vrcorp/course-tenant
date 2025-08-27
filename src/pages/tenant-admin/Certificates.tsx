import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import company from "@/data/company.json";

export default function TenantAdminCertificates() {
  type Cert = { id: string; template: string; issuer: string; published: boolean };
  const seed: Cert[] = [
    { id: "cf-1", template: "Classic", issuer: `${company.name} Academy`, published: true },
    { id: "cf-2", template: "Minimal", issuer: "Tech School", published: false },
  ];

  const [items, setItems] = useState<Cert[]>(seed);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ template: "", issuer: "", published: false });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((k) => k.template.toLowerCase().includes(q) || k.issuer.toLowerCase().includes(q));
  }, [items, query]);

  const resetForm = () => { setForm({ template: "", issuer: "", published: false }); setEditingId(null); };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.template.trim()) return;
    if (editingId) {
      setItems(prev => prev.map(k => k.id === editingId ? { ...k, ...form } as Cert : k));
    } else {
      const id = `cf-${Date.now()}`;
      setItems(prev => [{ id, ...form }, ...prev]);
    }
    resetForm();
  };

  const onEdit = (id: string) => {
    const k = items.find(i => i.id === id); if (!k) return;
    setEditingId(id); setForm({ template: k.template, issuer: k.issuer, published: k.published });
  };
  const onDelete = (id: string) => { setItems(prev => prev.filter(i => i.id !== id)); if (editingId === id) resetForm(); };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Tenant Admin · Certificates</h1>
      <Card className="mb-6">
        <CardHeader><CardTitle>{editingId ? "Edit Template" : "Add Template"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <Input placeholder="Template name" value={form.template} onChange={(e) => setForm(s => ({ ...s, template: e.target.value }))} />
            <Input placeholder="Issuer" value={form.issuer} onChange={(e) => setForm(s => ({ ...s, issuer: e.target.value }))} />
            <label className="flex items-center gap-2 text-sm md:col-auto col-span-1">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm(s => ({ ...s, published: e.target.checked }))} />
              Published
            </label>
            <Input className="md:col-span-2" placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button type="submit" className="md:col-auto"><Plus className="h-4 w-4 mr-2" /> {editingId ? "Update" : "Add"}</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((k) => (
          <Card key={k.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>{k.template}</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{k.published ? "published" : "draft"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Issuer: {k.issuer}</div>
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
