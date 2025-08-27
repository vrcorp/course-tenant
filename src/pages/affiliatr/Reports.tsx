import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import { useToast } from "@/hooks/use-toast";

type Commission = {
  id: string;
  date: string; // ISO
  linkId: string;
  amount: number;
  status: "pending" | "approved" | "paid" | "rejected";
};

type LinkItem = { id: string; title?: string; url?: string };

export default function AffiliatorReports() {
  const { toast } = useToast();

  // Load links and commissions from store with simple seeds
  const linkSeed: LinkItem[] = [
    { id: "L-1001", title: "Homepage CTA", url: "https://example.com/?ref=home" },
    { id: "L-1002", title: "LMS Pricing", url: "https://example.com/lms/pricing?ref=cta" },
  ];
  const [links, setLinks] = useState<LinkItem[]>(() => loadArray(STORE_KEYS.affiliateLinks, linkSeed));
  useEffect(() => saveArray(STORE_KEYS.affiliateLinks, links), [links]);

  const commSeed: Commission[] = [
    { id: "C-5001", date: new Date(Date.now() - 86400000 * 3).toISOString(), linkId: "L-1001", amount: 12.5, status: "approved" },
    { id: "C-5002", date: new Date(Date.now() - 86400000 * 2).toISOString(), linkId: "L-1002", amount: 25.0, status: "pending" },
    { id: "C-5003", date: new Date(Date.now() - 86400000 * 1).toISOString(), linkId: "L-1001", amount: 9.9, status: "paid" },
  ];
  const [commissions, setCommissions] = useState<Commission[]>(() => loadArray(STORE_KEYS.affiliateCommissions, commSeed));
  useEffect(() => saveArray(STORE_KEYS.affiliateCommissions, commissions), [commissions]);

  // Filters
  const [q, setQ] = useState("");
  const [linkFilter, setLinkFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const filtered = useMemo(() => {
    const fromTs = from ? new Date(from).getTime() : -Infinity;
    const toTs = to ? new Date(to).getTime() + 24 * 3600 * 1000 - 1 : Infinity;
    return commissions.filter((c) => {
      const t = new Date(c.date).getTime();
      if (t < fromTs || t > toTs) return false;
      if (linkFilter !== "all" && c.linkId !== linkFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (q.trim()) {
        const link = links.find((l) => l.id === c.linkId);
        const hay = `${c.id} ${c.amount} ${c.status} ${link?.title ?? ""} ${link?.url ?? ""}`.toLowerCase();
        if (!hay.includes(q.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [commissions, from, to, linkFilter, statusFilter, q, links]);

  const totals = useMemo(() => {
    return {
      count: filtered.length,
      amount: filtered.reduce((a, b) => a + b.amount, 0),
      paid: filtered.filter((c) => c.status === "paid").reduce((a, b) => a + b.amount, 0),
    };
  }, [filtered]);

  const setStatus = (id: string, status: Commission["status"]) => {
    setCommissions((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
    toast({ title: "Status updated", description: `${id} -> ${status}` });
  };

  const exportCSV = () => {
    const header = ["ID", "Date", "Link", "Title", "Amount", "Status"];
    const rows = filtered.map((c) => {
      const link = links.find((l) => l.id === c.linkId);
      return [c.id, new Date(c.date).toISOString(), link?.url ?? c.linkId, link?.title ?? "", c.amount.toFixed(2), c.status];
    });
    const csv = [header, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `affiliator-reports-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported", description: `${filtered.length} rows exported` });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground mt-2">Your referral reports with filters and export</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Input placeholder="Search (ID, title, status)" value={q} onChange={(e) => setQ(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">From</label>
                  <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">To</label>
                  <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Link</label>
                  <select className="border rounded h-9 px-2" value={linkFilter} onChange={(e) => setLinkFilter(e.target.value)}>
                    <option value="all">All</option>
                    {links.map((l) => (
                      <option key={l.id} value={l.id}>{l.title ?? l.url ?? l.id}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">Status</label>
                  <select className="border rounded h-9 px-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="paid">Paid</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <Button onClick={exportCSV} variant="secondary">Export CSV</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Rows</div>
                <div className="text-2xl font-bold">{totals.count}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Total Amount</div>
                <div className="text-2xl font-bold">${totals.amount.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Paid</div>
                <div className="text-2xl font-bold">${totals.paid.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No results match your filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-1">ID</th>
                    <th className="px-1">Date</th>
                    <th className="px-1">Link</th>
                    <th className="px-1">Title</th>
                    <th className="px-1">Amount</th>
                    <th className="px-1">Status</th>
                    <th className="px-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const link = links.find((l) => l.id === c.linkId);
                    return (
                      <tr key={c.id} className="border-t">
                        <td className="py-2 px-1">{c.id}</td>
                        <td className="px-1">{new Date(c.date).toLocaleString()}</td>
                        <td className="px-1 truncate max-w-[220px]">{link?.url ?? c.linkId}</td>
                        <td className="px-1">{link?.title ?? "-"}</td>
                        <td className="px-1">${c.amount.toFixed(2)}</td>
                        <td className="px-1 capitalize">{c.status}</td>
                        <td className="px-1">
                          <div className="flex gap-2">
                            {c.status !== "approved" && (
                              <Button size="sm" variant="outline" onClick={() => setStatus(c.id, "approved")}>Approve</Button>
                            )}
                            {c.status !== "paid" && (
                              <Button size="sm" variant="secondary" onClick={() => setStatus(c.id, "paid")}>Mark Paid</Button>
                            )}
                            {c.status !== "rejected" && (
                              <Button size="sm" variant="destructive" onClick={() => setStatus(c.id, "rejected")}>Reject</Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
