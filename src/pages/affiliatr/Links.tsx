import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import { useToast } from "@/hooks/use-toast";

type LinkItem = { id: string; code: string; product: "course"; url: string; clicks: number; active: boolean };

export default function AffiliatorLinks() {
  const { toast } = useToast();
  const seed: LinkItem[] = [
    { id: "LNK-001", code: "abc123", product: "course", url: "/courses/pricing?ref=abc123", clicks: 42, active: true },
  ];
  const [items, setItems] = useState<LinkItem[]>(() => loadArray(STORE_KEYS.affiliateLinks, seed));
  useEffect(() => saveArray(STORE_KEYS.affiliateLinks, items), [items]);

  const [code, setCode] = useState("");
  const [product, setProduct] = useState<"course">("course");

  const previewUrl = useMemo(() => `/courses/pricing?ref=${code || "yourcode"}`, [code]);

  const addLink = () => {
    if (!code.trim()) {
      toast({ title: "Code required", description: "Please enter a referral code." });
      return;
    }
    if (items.some(i => i.code === code.trim())) {
      toast({ title: "Duplicate code", description: "That code already exists." });
      return;
    }
    const id = `LNK-${Math.floor(Math.random()*9000+1000)}`;
    const url = `/courses/pricing?ref=${code.trim()}`;
    const next = [...items, { id, code: code.trim(), product, url, clicks: 0, active: true }];
    setItems(next);
    setCode("");
    toast({ title: "Link created", description: `Code ${id} added.` });
  };

  const remove = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast({ title: "Link removed" });
  };

  const toggleActive = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, active: !i.active } : i));
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(location.origin + text);
      toast({ title: "Copied", description: "Referral URL copied to clipboard." });
    } catch {
      toast({ title: "Copy failed" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Affiliate Links</h1>
        <p className="text-muted-foreground mt-2">Manage and copy your referral links</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm">Product</label>
              <select className="border rounded h-9 px-2" value={product} onChange={(e) => setProduct(e.target.value as any)}>
                <option value="video">Video Hosting</option>
                <option value="lms">LMS</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Referral Code</label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. mycode123" />
            </div>
            <div className="flex items-end">
              <Button onClick={addLink} className="w-full">Add Link</Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Preview: {previewUrl}</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-2">ID</th>
                    <th>Code</th>
                    <th>Product</th>
                    <th>Clicks</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(i => (
                    <tr key={i.id} className="border-t">
                      <td className="py-2">{i.id}</td>
                      <td>{i.code}</td>
                      <td className="uppercase">{i.product}</td>
                      <td>{i.clicks}</td>
                      <td>{i.active ? "Active" : "Inactive"}</td>
                      <td className="flex gap-2 py-2">
                        <Button variant="secondary" onClick={() => copy(i.url)}>Copy</Button>
                        <Button variant="outline" onClick={() => toggleActive(i.id)}>{i.active ? "Disable" : "Enable"}</Button>
                        <Button variant="destructive" onClick={() => remove(i.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
