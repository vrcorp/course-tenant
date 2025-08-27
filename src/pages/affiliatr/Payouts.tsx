import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import { useToast } from "@/hooks/use-toast";

type Payout = { id: string; date: string; amount: number; method: "bank" | "paypal"; account: string; status: "requested" | "paid" | "rejected" };

export default function AffiliatorPayouts() {
  const { toast } = useToast();
  const seed: Payout[] = [
    { id: "PAYOUT-1", date: new Date().toISOString(), amount: 20.0, method: "bank", account: "BCA 123-456", status: "paid" },
  ];
  const [items, setItems] = useState<Payout[]>(() => loadArray(STORE_KEYS.affiliatePayouts, seed));
  useEffect(() => saveArray(STORE_KEYS.affiliatePayouts, items), [items]);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Payout["method"]>("bank");
  const [account, setAccount] = useState("");

  const totals = useMemo(() => ({
    requested: items.filter(i => i.status === "requested").reduce((a, b) => a + b.amount, 0),
    paid: items.filter(i => i.status === "paid").reduce((a, b) => a + b.amount, 0),
  }), [items]);

  const request = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0 || !account.trim()) {
      toast({ title: "Invalid data", description: "Enter a positive amount and payout account." });
      return;
    }
    const id = `PAYOUT-${Math.floor(Math.random()*90000+10000)}`;
    const next: Payout = { id, date: new Date().toISOString(), amount: val, method, account: account.trim(), status: "requested" };
    setItems([next, ...items]);
    setAmount(""); setAccount("");
    toast({ title: "Payout requested", description: `${id} submitted.` });
  };

  const markPaid = (id: string) => setItems(items.map(i => i.id === id ? { ...i, status: "paid" } : i));
  const reject = (id: string) => setItems(items.map(i => i.id === id ? { ...i, status: "rejected" } : i));
  const remove = (id: string) => { setItems(items.filter(i => i.id !== id)); toast({ title: "Payout removed" }); };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payouts</h1>
        <p className="text-muted-foreground mt-2">View and request payouts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Totals</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Requested</div>
                <div className="text-2xl font-bold">${totals.requested.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Paid</div>
                <div className="text-2xl font-bold">${totals.paid.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Request Payout</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label className="text-sm">Amount</label>
                <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 25.00" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">Method</label>
                <select className="border rounded h-9 px-2" value={method} onChange={(e) => setMethod(e.target.value as any)}>
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm">Account</label>
                <Input value={account} onChange={(e) => setAccount(e.target.value)} placeholder={method === "bank" ? "Bank acc (e.g. BCA 123)" : "PayPal email"} />
              </div>
            </div>
            <Button onClick={request} className="mt-3 w-full">Submit Request</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payout requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-2">ID</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Account</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(i => (
                    <tr key={i.id} className="border-t">
                      <td className="py-2">{i.id}</td>
                      <td>{new Date(i.date).toLocaleString()}</td>
                      <td>${i.amount.toFixed(2)}</td>
                      <td className="uppercase">{i.method}</td>
                      <td>{i.account}</td>
                      <td className="capitalize">{i.status}</td>
                      <td className="flex gap-2 py-2">
                        {i.status !== "paid" && (
                          <Button variant="secondary" onClick={() => markPaid(i.id)}>Mark Paid</Button>
                        )}
                        {i.status !== "rejected" && (
                          <Button variant="outline" onClick={() => reject(i.id)}>Reject</Button>
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
