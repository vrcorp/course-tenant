import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function TenantAdminSettings() {
  const [tenantName, setTenantName] = useState("My Tenant");
  const [domain, setDomain] = useState("my-tenant.videmyhub.com");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const onSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSavedAt(new Date().toLocaleString());
    }, 700);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Tenant Admin · Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Tenant Settings (dummy)</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={(e) => e.preventDefault()}>
            <Input placeholder="Tenant Name" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
            <Input placeholder="Custom Domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
            <Button type="button" onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            {savedAt && <div className="text-sm text-muted-foreground self-center">Saved at {savedAt}</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
