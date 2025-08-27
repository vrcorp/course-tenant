import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loadArray, STORE_KEYS } from "@/lib/dataStore";
import { useToast } from "@/hooks/use-toast";

type LinkItem = { id: string; code?: string; product?: "course"; url?: string; clicks: number; active?: boolean; title?: string };
type Commission = { id: string; date: string; linkId: string; amount: number; status: "pending" | "approved" | "paid" | "rejected" };

type Row = {
  linkId: string;
  title: string;
  url: string;
  clicks: number;
  conversions: number; // approved + paid
  revenue: number; // sum amount
  epc: number; // revenue per click
};

export default function AffiliatorAnalytics() {
  const { toast } = useToast();

  // Load this affiliator's links and global commissions
  const links = loadArray<LinkItem>(STORE_KEYS.affiliateLinks, [] as any[]);
  const commissions = loadArray<Commission>(STORE_KEYS.affiliateCommissions, [] as any[]);

  // Filters
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const dateIn = (iso: string) => {
    const t = new Date(iso).getTime();
    const a = from ? new Date(from).getTime() : -Infinity;
    const b = to ? new Date(to).getTime() + 24 * 3600 * 1000 - 1 : Infinity;
    return t >= a && t <= b;
  };

  const rowsAll: Row[] = useMemo(() => {
    const byLink: Record<string, Row> = {};
    // Initialize rows from links (owned by this affiliator in this demo store)
    links.forEach(l => {
      byLink[l.id] = {
        linkId: l.id,
        title: l.title ?? l.code ?? l.id,
        url: l.url ?? l.code ?? l.id,
        clicks: l.clicks || 0,
        conversions: 0,
        revenue: 0,
        epc: 0,
      };
    });

    // Aggregate commissions by link with date window applied
    const commFiltered = commissions.filter(c => dateIn(c.date));
    commFiltered.forEach(c => {
      const row = byLink[c.linkId];
      if (!row) return; // commission not for our link set
      row.revenue += c.amount || 0;
      if (c.status === "approved" || c.status === "paid") row.conversions += 1;
    });

    Object.values(byLink).forEach(r => {
      r.epc = r.clicks > 0 ? r.revenue / r.clicks : 0;
    });

    return Object.values(byLink);
  }, [links, commissions, from, to]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return rowsAll;
    return rowsAll.filter(r => `${r.linkId} ${r.title} ${r.url}`.toLowerCase().includes(t));
  }, [rowsAll, q]);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  useEffect(() => { setPage(1); }, [q, from, to, rowsAll.length]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totals = useMemo(() => ({
    links: filtered.length,
    clicks: filtered.reduce((a,b)=>a+b.clicks,0),
    revenue: filtered.reduce((a,b)=>a+b.revenue,0),
    conversions: filtered.reduce((a,b)=>a+b.conversions,0),
    epc: (function(){ const clicks = filtered.reduce((a,b)=>a+b.clicks,0); const rev = filtered.reduce((a,b)=>a+b.revenue,0); return clicks>0? rev/clicks : 0; })(),
  }), [filtered]);

  const exportCSV = () => {
    const header = ["LinkID","Title","URL","Clicks","Conversions","Revenue","EPC"];
    const rows = filtered.map(r => [r.linkId, r.title, r.url, r.clicks, r.conversions, r.revenue.toFixed(2), r.epc.toFixed(4)]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `my-affiliate-analytics-${Date.now()}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">Performance metrics for your affiliate links</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Input placeholder="Search (ID, title, URL)" value={q} onChange={e=>setQ(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">From</label>
                  <Input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground">To</label>
                  <Input type="date" value={to} onChange={e=>setTo(e.target.value)} />
                </div>
              </div>
              <Button variant="secondary" onClick={exportCSV}>Export CSV</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Links</div>
                <div className="text-2xl font-bold">{totals.links}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Clicks</div>
                <div className="text-2xl font-bold">{totals.clicks}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Conversions</div>
                <div className="text-2xl font-bold">{totals.conversions}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Revenue</div>
                <div className="text-2xl font-bold">${totals.revenue.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">EPC</div>
                <div className="text-2xl font-bold">${totals.epc.toFixed(4)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Per-Link Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No links match your filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="py-2 px-1">Link</th>
                    <th className="px-1">Clicks</th>
                    <th className="px-1">Conversions</th>
                    <th className="px-1">Revenue</th>
                    <th className="px-1">EPC</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(r => (
                    <tr key={r.linkId} className="border-t">
                      <td className="py-2 px-1">
                        <div className="flex flex-col">
                          <span className="font-medium">{r.title}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[360px]">{r.url}</span>
                        </div>
                      </td>
                      <td className="px-1">{r.clicks}</td>
                      <td className="px-1">{r.conversions}</td>
                      <td className="px-1">${r.revenue.toFixed(2)}</td>
                      <td className="px-1">${r.epc.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length > pageSize && (
                <div className="flex items-center justify-end gap-2 mt-3">
                  <Button size="sm" variant="outline" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</Button>
                  <span className="text-xs">Page {page} / {totalPages}</span>
                  <Button size="sm" variant="outline" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
