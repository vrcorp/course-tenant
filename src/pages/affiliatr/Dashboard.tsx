import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadArray, STORE_KEYS } from "@/lib/dataStore";

export default function AffiliatorDashboard() {
  const links = useMemo(() => loadArray(STORE_KEYS.affiliateLinks, [
    { id: "LNK-001", code: "abc123", product: "course", url: "/courses/pricing?ref=abc123", clicks: 42, active: true },

  ] as any[]), []);
  const commissions = useMemo(() => loadArray(STORE_KEYS.affiliateCommissions, [
    { id: "COM-1001", date: new Date().toISOString(), linkCode: "abc123", orderId: "ORD-1", amount: 12.5, status: "approved" },
    { id: "COM-1002", date: new Date().toISOString(), linkCode: "lms999", orderId: "ORD-2", amount: 8.0, status: "pending" },
  ] as any[]), []);
  const payouts = useMemo(() => loadArray(STORE_KEYS.affiliatePayouts, [
    { id: "PAYOUT-1", date: new Date().toISOString(), amount: 20.0, status: "paid" },
  ] as any[]), []);

  const totalClicks = links.reduce((a: number, l: any) => a + (l.clicks || 0), 0);
  const conversions = commissions.length;
  const approvedEarnings = commissions.filter((c: any) => c.status === "approved").reduce((a: number, c: any) => a + (c.amount || 0), 0);
  const paidOut = payouts.filter((p: any) => p.status === "paid").reduce((a: number, p: any) => a + (p.amount || 0), 0);
  const pendingPayout = Math.max(0, approvedEarnings - paidOut);

  const recentComms = commissions.slice(0, 5);
  const topLinks = [...links].sort((a: any, b: any) => (b.clicks || 0) - (a.clicks || 0)).slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Affiliator Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of your affiliate performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Total Clicks</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-extrabold">{totalClicks}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Conversions</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-extrabold">{conversions}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Approved Earnings</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-extrabold">${approvedEarnings.toFixed(2)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Payout</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-extrabold">${pendingPayout.toFixed(2)}</div></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader><CardTitle>Top Links</CardTitle></CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              {topLinks.map((l: any) => (
                <li key={l.id} className="flex items-center justify-between">
                  <span>{l.code} — {l.product}</span>
                  <span className="font-medium">{l.clicks} clicks</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Commissions</CardTitle></CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              {recentComms.map((c: any) => (
                <li key={c.id} className="flex items-center justify-between">
                  <span>#{c.id} — {c.linkCode}</span>
                  <span className="font-medium">${c.amount.toFixed(2)} <span className="text-xs text-muted-foreground">({c.status})</span></span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
