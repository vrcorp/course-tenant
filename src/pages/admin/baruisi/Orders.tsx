import { useEffect, useMemo, useState } from "react";
import seed from "@/data/admin_orders.json";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Search, X, ChevronLeft, ChevronRight, Pencil } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Order { id: string; type: "video_hosting" | "lms"; userId: string; packageId: string; packageName: string; amount: number; status: "pending" | "paid" | "cancelled"; createdAt: string }

export default function AdminOrders() {
  const [items, setItems] = useState<Order[]>([]);
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState<"all" | "video_hosting" | "lms">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<"pending" | "paid" | "cancelled">("pending");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seedNorm = (seed as any[]).map((o: any) => ({ ...o }));
    const initial = loadArray<Order>(STORE_KEYS.orders, seedNorm);
    setItems(initial);
  }, []);

  const filtered = useMemo(() => {
    const t = q.toLowerCase();
    return items.filter(i =>
      (filterType === "all" || i.type === filterType) &&
      (`${i.id} ${i.userId} ${i.packageName}`.toLowerCase().includes(t))
    );
  }, [items, q, filterType]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => setPage(1), [q, filterType, items.length]);

  const startEdit = (id: string, current: Order) => {
    setEditingId(id);
    setStatusDraft(current.status);
    setOpen(true);
  };
  const save = () => {
    if (!editingId) return;
    const next = items.map(i => i.id === editingId ? { ...i, status: statusDraft } : i);
    setItems(next);
    saveArray(STORE_KEYS.orders, next);
    setEditingId(null);
    setOpen(false);
    toast({ title: "Order updated", description: `Status changed to ${statusDraft}.` });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        <p className="text-muted-foreground mt-2">Manage all orders across products</p>
      </div>

      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Orders</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  placeholder="Search orders..." 
                  className="w-full md:w-64 pl-10 rounded-lg bg-white" 
                />
              </div>
              <Select value={filterType} onValueChange={(v: any) => setFilterType(v)}>
                <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Filter type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="video_hosting">Video Hosting</SelectItem>
                  <SelectItem value="lms">LMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditingId(null); }}>
            <DialogContent className="sm:max-w-[650px] rounded-xl">
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="text-sm text-muted-foreground">Choose a new status</div>
                <Select value={statusDraft} onValueChange={(v: any) => setStatusDraft(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setEditingId(null); setOpen(false); }}>
                  <X className="h-4 w-4 mr-2"/>Cancel
                </Button>
                <Button onClick={save} className="bg-blue-600 hover:bg-blue-700">Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="text-center p-10">
                <div className="text-gray-400 mb-2">No orders found</div>
                <p className="text-sm text-gray-500">Try adjusting your search</p>
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500 font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{o.id}</td>
                    <td className="px-6 py-4">{o.type === 'lms' ? <Badge>LMS</Badge> : <Badge variant="secondary">Video Hosting</Badge>}</td>
                    <td className="px-6 py-4">{o.userId}</td>
                    <td className="px-6 py-4">{o.packageName}</td>
                    <td className="px-6 py-4">Rp {o.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">{o.status === 'paid' ? <Badge className="bg-green-600 hover:bg-green-600">Paid</Badge> : o.status === 'pending' ? <Badge variant="secondary">Pending</Badge> : <Badge variant="outline">Cancelled</Badge>}</td>
                    <td className="px-6 py-4">{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => startEdit(o.id, o)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4"/>
                          <span className="sr-only">Edit</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
            {filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t">
                <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(page * pageSize, filtered.length)}</span> of{" "}
                  <span className="font-medium">{filtered.length}</span> results
                </span>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={page <= 1} 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <Button
                        key={p}
                        size="sm"
                        variant={page === p ? "default" : "outline"}
                        onClick={() => setPage(p)}
                        className="h-8 w-8 p-0"
                      >
                        {p}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={page >= totalPages} 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
