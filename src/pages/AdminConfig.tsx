import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import seed from "@/data/admin_global_config.json";
import { loadObject, saveObject, STORE_KEYS } from "@/lib/dataStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminConfig() {
  const [form, setForm] = useState({
    maintenanceMode: false,
    defaultCurrency: "IDR",
    timezone: "Asia/Jakarta",
    allowRegistrations: true,
  });
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const initial = loadObject<typeof form>(STORE_KEYS.globalConfig, seed as any);
    setForm(initial);
  }, []);

  const save = () => {
    saveObject(STORE_KEYS.globalConfig, form);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    setOpen(false);
    toast({ title: "Global configuration saved" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin - Global Config</h1>
        <p className="text-muted-foreground mt-2">Global configuration</p>
      </div>

      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-gray-50 border-b">
          <CardTitle className="text-xl font-semibold text-gray-800">Configuration</CardTitle>
          <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">Edit Settings</Button>
        </CardHeader>
        <CardContent>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-xl rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">Edit Global Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={form.maintenanceMode} onChange={e => setForm({ ...form, maintenanceMode: e.target.checked })} />
                  <span>Maintenance Mode</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <Select value={form.defaultCurrency} onValueChange={(v) => setForm({ ...form, defaultCurrency: v })}>
                      <SelectTrigger><SelectValue placeholder="Currency" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IDR">IDR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={form.timezone} onValueChange={(v) => setForm({ ...form, timezone: v })}>
                      <SelectTrigger><SelectValue placeholder="Timezone" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Jakarta">Asia/Jakarta</SelectItem>
                        <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={form.allowRegistrations} onChange={e => setForm({ ...form, allowRegistrations: e.target.checked })} />
                  <span>Allow Registrations</span>
                </label>
              </div>
              <DialogFooter>
                <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">Save Settings</Button>
                {saved && <span className="text-sm text-green-600">Saved</span>}
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="space-y-1">
              <div className="text-muted-foreground">Maintenance</div>
              {form.maintenanceMode ? <Badge variant="secondary">On</Badge> : <Badge>Off</Badge>}
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Currency</div>
              <div>{form.defaultCurrency}</div>
            </div>
            <div className="space-y-1">
              <div className="text-muted-foreground">Timezone</div>
              <div>{form.timezone}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
