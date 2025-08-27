import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Plus, Search, Filter, Calendar, User, DollarSign, CreditCard, FileText, MoreVertical } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type Payout = {
  id: string;
  date: string; // ISO
  affiliatorId: string;
  affiliatorName?: string;
  amount: number;
  method: "bank" | "ewallet" | "paypal";
  note?: string;
  status: "requested" | "approved" | "paid" | "rejected";
};

export default function AdminAffiliatorPayouts() {
  const { toast } = useToast();
  const seed: Payout[] = [
    { id: "P-7001", date: new Date(Date.now() - 86400000 * 6).toISOString(), affiliatorId: "A-100", affiliatorName: "Alice", amount: 50, method: "bank", status: "requested" },
    { id: "P-7002", date: new Date(Date.now() - 86400000 * 2).toISOString(), affiliatorId: "A-200", affiliatorName: "Bob", amount: 120, method: "paypal", status: "approved" },
  ];
  const [items, setItems] = useState<Payout[]>(() => loadArray(STORE_KEYS.affiliatePayouts, seed as any));
  useEffect(() => saveArray(STORE_KEYS.affiliatePayouts, items as any), [items]);

  // Filters
  const [q, setQ] = useState("");
  const [aff, setAff] = useState("all");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const affiliators = useMemo(() => {
    const m = new Map<string, string>();
    items.forEach(p => m.set(p.affiliatorId, p.affiliatorName || p.affiliatorId));
    return Array.from(m.entries()).map(([id, name]) => ({ id, name }));
  }, [items]);

  const filtered = useMemo(() => {
    const fromTs = from ? new Date(from).getTime() : -Infinity;
    const toTs = to ? new Date(to).getTime() + 24 * 3600 * 1000 - 1 : Infinity;
    return items.filter(p => {
      const t = new Date(p.date).getTime();
      if (t < fromTs || t > toTs) return false;
      if (aff !== "all" && p.affiliatorId !== aff) return false;
      if (status !== "all" && p.status !== status) return false;
      if (method !== "all" && p.method !== method) return false;
      if (q.trim()) {
        const hay = `${p.id} ${p.affiliatorId} ${p.affiliatorName ?? ""} ${p.amount} ${p.method} ${p.status} ${p.note ?? ""}`.toLowerCase();
        if (!hay.includes(q.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [items, q, aff, status, method, from, to]);

  // Add/Edit dialog
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Payout>({ id: "", date: new Date().toISOString().slice(0,10), affiliatorId: "", affiliatorName: "", amount: 0, method: "bank", status: "requested" });

  const startAdd = () => { setEditing(null); setForm({ id: "", date: new Date().toISOString().slice(0,10), affiliatorId: "", affiliatorName: "", amount: 0, method: "bank", status: "requested" }); setOpen(true); };
  const startEdit = (id: string) => {
    const it = items.find(i => i.id === id);
    if (it) { setEditing(id); setForm({ ...it, date: it.date.slice(0,10) }); setOpen(true); }
  };
  const save = () => {
    if (!form.id || !form.affiliatorId || !form.affiliatorName || !form.date) {
      toast({ variant: "destructive", title: "Missing fields", description: "ID, Affiliator, Date are required" });
      return;
    }
    const payload: Payout = { ...form, date: new Date(form.date).toISOString(), amount: Number(form.amount) };
    if (editing) {
      const next = items.map(i => i.id === editing ? payload : i);
      setItems(next); toast({ title: "Payout updated", description: payload.id });
    } else {
      if (items.some(i => i.id === payload.id)) { toast({ variant: "destructive", title: "Duplicate ID", description: payload.id }); return; }
      const next = [payload, ...items]; setItems(next); toast({ title: "Payout added", description: payload.id });
    }
    setOpen(false); setEditing(null);
  };

  // Actions
  const approve = (id: string) => { setItems(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p)); toast({ title: "Approved", description: id }); };
  const markPaid = (id: string) => { setItems(prev => prev.map(p => p.id === id ? { ...p, status: "paid" } : p)); toast({ title: "Marked Paid", description: id }); };
  const reject = (id: string) => { setItems(prev => prev.map(p => p.id === id ? { ...p, status: "rejected" } : p)); toast({ variant: "destructive", title: "Rejected", description: id }); };
  const remove = (id: string) => { setItems(prev => prev.filter(p => p.id !== id)); toast({ title: "Deleted", description: id }); };

  const exportCSV = () => {
    const header = ["ID","Date","AffiliatorID","Affiliator","Amount","Method","Status","Note"];
    const rows = filtered.map(p => [p.id, new Date(p.date).toISOString(), p.affiliatorId, p.affiliatorName ?? "", p.amount.toFixed(2), p.method, p.status, p.note ?? ""]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `payouts-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${filtered.length} rows` });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "requested": 
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Requested</Badge>;
      case "approved": 
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Approved</Badge>;
      case "paid": 
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Paid</Badge>;
      case "rejected": 
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getMethodIcon = (method: string) => {
    switch(method) {
      case "bank": return <CreditCard className="h-4 w-4" />;
      case "ewallet": return <DollarSign className="h-4 w-4" />;
      case "paypal": return <CreditCard className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  // Detail modal state
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<Payout | null>(null);
  const showDetail = (p: Payout) => { setDetail(p); setDetailOpen(true); };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Affiliator Payouts</h1>
        <p className="text-muted-foreground mt-2">Review and process affiliator payout requests</p>
      </div>

      <div className="space-y-4">
        {/* Filters Card */}
        <Card className="shadow-lg border-0 rounded-xl">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Filters</CardTitle>
              <Filter className="h-5 w-5 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search payouts..." 
                  value={q} 
                  onChange={e=>setQ(e.target.value)} 
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">From Date</Label>
                  <Input 
                    type="date" 
                    value={from} 
                    onChange={e=>setFrom(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">To Date</Label>
                  <Input 
                    type="date" 
                    value={to} 
                    onChange={e=>setTo(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Affiliator</Label>
                <Select value={aff} onValueChange={setAff}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Affiliators" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Affiliators</SelectItem>
                    {affiliators.map(a => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="requested">Requested</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Methods</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="ewallet">E-Wallet</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={exportCSV} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={startAdd} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Details Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Payout Details</DialogTitle>
            {detail?.id && (
              <DialogDescription>ID: {detail.id}</DialogDescription>
            )}
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{detail ? new Date(detail.date).toLocaleString() : "-"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Amount</div>
              <div className="font-medium">{detail ? `$${detail.amount.toFixed(2)}` : "-"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Affiliator</div>
              <div className="font-medium">{detail?.affiliatorName ?? detail?.affiliatorId}</div>
              <div className="text-xs text-muted-foreground">ID: {detail?.affiliatorId}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Method</div>
              <div className="font-medium capitalize flex items-center gap-1">
                {detail ? getMethodIcon(detail.method) : null}
                {detail?.method}
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-muted-foreground">Note</div>
              <div className="font-medium">{detail?.note || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className="mt-1">{detail ? getStatusBadge(detail.status) : null}</div>
            </div>
          </div>
          <DialogFooter className="flex flex-wrap gap-2">
            <div className="flex-1" />
            <Button variant="outline" onClick={()=>{ if(detail){ setDetailOpen(false); startEdit(detail.id); } }}>Edit</Button>
            {detail && detail.status !== "approved" && (
              <Button variant="secondary" onClick={()=>{ if(detail){ approve(detail.id); setDetailOpen(false); } }}>Approve</Button>
            )}
            {detail && detail.status !== "paid" && (
              <Button onClick={()=>{ if(detail){ markPaid(detail.id); setDetailOpen(false); } }}>Mark Paid</Button>
            )}
            {detail && detail.status !== "rejected" && (
              <Button variant="destructive" onClick={()=>{ if(detail){ reject(detail.id); setDetailOpen(false); } }}>Reject</Button>
            )}
            {detail && (
              <Button variant="destructive" onClick={()=>{ if(detail){ remove(detail.id); setDetailOpen(false); } }}>Delete</Button>
            )}
            <Button variant="outline" onClick={()=>setDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

        {/* Summary Cards */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4 content-start">
          <Card className="shadow-lg border-0 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-2">
              <CardDescription>Total Payouts</CardDescription>
              <CardTitle className="text-2xl">{filtered.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-blue-600">
                <FileText className="h-4 w-4 mr-1" />
                Matching filters
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-2">
              <CardDescription>Total Amount</CardDescription>
              <CardTitle className="text-2xl">${filtered.reduce((a,b)=>a+b.amount,0).toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <DollarSign className="h-4 w-4 mr-1" />
                All payouts
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-2">
              <CardDescription>Paid Amount</CardDescription>
              <CardTitle className="text-2xl">${filtered.filter(p=>p.status==="paid").reduce((a,b)=>a+b.amount,0).toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-purple-600">
                <DollarSign className="h-4 w-4 mr-1" />
                Completed payouts
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100">
            <CardHeader className="pb-2">
              <CardDescription>Pending Approval</CardDescription>
              <CardTitle className="text-2xl">{filtered.filter(p=>p.status==="requested").length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-amber-600">
                <FileText className="h-4 w-4 mr-1" />
                Needs review
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payout Queue - Desktop Table and Mobile Cards */}
      <Card className="mt-6 shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle>Payout Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center p-10">
              <div className="text-gray-400 mb-2">No payouts found</div>
              <p className="text-sm text-gray-500">Try adjusting your filters or add a new payout</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <div className="overflow-x-auto md:overflow-hidden">
                  <table className="divide-y divide-gray-200 w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-sm text-gray-500 font-medium uppercase tracking-wider">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Affiliator</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filtered.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{p.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(p.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">{p.affiliatorName ?? p.affiliatorId}</div>
                            <div className="text-sm text-muted-foreground">ID: {p.affiliatorId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          ${p.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(p.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={()=>showDetail(p)}>Details</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                <div className="divide-y divide-gray-200">
                  {filtered.map(p => (
                    <div key={p.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium text-gray-900">{p.id}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(p.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-lg">${p.amount.toFixed(2)}</div>
                          {getStatusBadge(p.status)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <div className="text-muted-foreground">Affiliator</div>
                          <div className="font-medium">{p.affiliatorName ?? p.affiliatorId}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Method</div>
                          <div className="font-medium capitalize flex items-center gap-1">
                            {getMethodIcon(p.method)}
                            {p.method}
                          </div>
                        </div>
                      </div>
                      
                      {p.note && (
                        <div className="mb-3">
                          <div className="text-muted-foreground text-sm">Note</div>
                          <div className="text-sm">{p.note}</div>
                        </div>
                      )}
                      
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={()=>showDetail(p)} className="flex-1">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent  className="sm:max-w-[650px] rounded-xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {editing ? "Edit Payout" : "Add New Payout"}
            </DialogTitle>
            <DialogDescription>
              {editing ? "Update the payout details" : "Fill in the details to add a new payout"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="id">ID *</Label>
              <Input 
                id="id" 
                value={form.id} 
                onChange={e=>setForm({...form,id:e.target.value})} 
                placeholder="Payout ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input 
                id="date" 
                type="date" 
                value={form.date} 
                onChange={e=>setForm({...form,date:e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="affId">Affiliator ID *</Label>
              <Input 
                id="affId" 
                value={form.affiliatorId} 
                onChange={e=>setForm({...form,affiliatorId:e.target.value})} 
                placeholder="Affiliator ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="affName">Affiliator Name *</Label>
              <Input 
                id="affName" 
                value={form.affiliatorName} 
                onChange={e=>setForm({...form,affiliatorName:e.target.value})} 
                placeholder="Affiliator Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input 
                id="amount" 
                type="number" 
                value={form.amount} 
                onChange={e=>setForm({...form,amount:Number(e.target.value)})} 
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Select 
                value={form.method} 
                onValueChange={(value: "bank" | "ewallet" | "paypal") => setForm({...form, method: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="ewallet">E-Wallet</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="note">Note</Label>
              <Input 
                id="note" 
                value={form.note ?? ""} 
                onChange={e=>setForm({...form,note:e.target.value})} 
                placeholder="Optional note"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={form.status} 
                onValueChange={(value: "requested" | "approved" | "paid" | "rejected") => setForm({...form, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="requested">Requested</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">
              {editing ? "Save Changes" : "Create Payout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}