import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import { useToast } from "@/hooks/use-toast";

type Commission = { id: string; date: string; linkCode: string; orderId: string; amount: number; status: "pending" | "approved" | "rejected" };

export default function AffiliatorCommissions() {
  const { toast } = useToast();
  const seed: Commission[] = [
    { id: "COM-1001", date: new Date().toISOString(), linkCode: "abc123", orderId: "ORD-1", amount: 12.5, status: "approved" },
    { id: "COM-1002", date: new Date().toISOString(), linkCode: "lms999", orderId: "ORD-2", amount: 8.0, status: "pending" },
  ];
  const [items, setItems] = useState<Commission[]>(() => loadArray(STORE_KEYS.affiliateCommissions, seed));
  useEffect(() => saveArray(STORE_KEYS.affiliateCommissions, items), [items]);

  const [status, setStatus] = useState<"all" | Commission["status"]>("all");
  const [linkCode, setLinkCode] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");

  const filtered = useMemo(() => items.filter(i => status === "all" ? true : i.status === status), [items, status]);
  const totals = useMemo(() => ({
    approved: items.filter(i => i.status === "approved").reduce((a, b) => a + b.amount, 0),
    pending: items.filter(i => i.status === "pending").reduce((a, b) => a + b.amount, 0),
    rejected: items.filter(i => i.status === "rejected").reduce((a, b) => a + b.amount, 0),
  }), [items]);

  const add = () => {
    const val = parseFloat(amount);
    if (!linkCode.trim() || !orderId.trim() || isNaN(val) || val <= 0) {
      toast({ title: "Invalid data", description: "Fill link code, order ID and positive amount." });
      return;
    }
    const id = `COM-${Math.floor(Math.random()*90000+10000)}`;
    const next: Commission = { id, date: new Date().toISOString(), linkCode: linkCode.trim(), orderId: orderId.trim(), amount: val, status: "pending" };
    setItems([next, ...items]);
    setLinkCode(""); setOrderId(""); setAmount("");
    toast({ title: "Commission added", description: `${id} created as pending.` });
  };

  const setStatusFor = (id: string, st: Commission["status"]) => {
    setItems(items.map(i => i.id === id ? { ...i, status: st } : i));
  };

  const remove = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    toast({ title: "Commission removed" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Commissions</h1>
        <p className="text-muted-foreground mt-2">Track your earned commissions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Approved</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">${totals.approved.toFixed(2)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">${totals.pending.toFixed(2)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Rejected</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">${totals.rejected.toFixed(2)}</div></CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Add Commission (Manual)</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm">Link Code</label>
              <Input value={linkCode} onChange={(e) => setLinkCode(e.target.value)} placeholder="e.g. abc123" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Order ID</label>
              <Input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="e.g. ORD-100" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm">Amount</label>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 10.00" />
            </div>
            <div className="flex items-end">
              <Button onClick={add} className="w-full">Add</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader><CardTitle>Commission History</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm">Filter:</span>
            <select className="border rounded h-9 px-2" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No commissions.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-2">ID</th>
                    <th>Date</th>
                    <th>Link</th>
                    <th>Order</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(i => (
                    <tr key={i.id} className="border-t">
                      <td className="py-2">{i.id}</td>
                      <td>{new Date(i.date).toLocaleString()}</td>
                      <td>{i.linkCode}</td>
                      <td>{i.orderId}</td>
                      <td>${i.amount.toFixed(2)}</td>
                      <td className="capitalize">{i.status}</td>
                      <td className="flex gap-2 py-2">
                        {i.status !== "approved" && (
                          <Button variant="secondary" onClick={() => setStatusFor(i.id, "approved")}>Approve</Button>
                        )}
                        {i.status !== "rejected" && (
                          <Button variant="outline" onClick={() => setStatusFor(i.id, "rejected")}>Reject</Button>
                        )}
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
