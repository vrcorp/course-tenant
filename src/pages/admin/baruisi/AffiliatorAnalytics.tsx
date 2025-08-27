import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { loadArray, STORE_KEYS } from "@/lib/dataStore";
import { 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  X, 
  Users, 
  MousePointerClick, 
  DollarSign, 
  TrendingUp,
  Calendar,
  SortAsc,
  SortDesc,
  BarChart3,
  Eye,
  EyeOff
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type LinkItem = { id: string; code: string; product: "course"; url: string; clicks: number; active: boolean; affiliatorId?: string; affiliatorName?: string };
type Commission = { id: string; date: string; affiliatorId: string; affiliatorName?: string; linkId: string; amount: number; status: "pending" | "approved" | "paid" | "rejected" };
type Payout = { id: string; date: string; affiliatorId: string; affiliatorName?: string; amount: number; method: "bank" | "ewallet" | "paypal"; status: "requested" | "approved" | "paid" | "rejected" };

type Row = {
  affiliatorId: string;
  affiliatorName: string;
  clicks: number;
  conversions: number; // approved + paid
  totalCommissions: number; // sum of commissions
  paidOut: number; // sum payouts with status paid
  epc: number; // earnings per click
  approvalRate: number; // conversions / total commissions records
};

export default function AdminAffiliatorAnalytics() {
  const { toast } = useToast();

  // Load data sources
  const links = loadArray<LinkItem>(STORE_KEYS.affiliateLinks, [] as any[]);
  const commissions = loadArray<Commission>(STORE_KEYS.affiliateCommissions, [] as any[]);
  const payouts = loadArray<Payout>(STORE_KEYS.affiliatePayouts, [] as any[]);

  // Filters
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sortBy, setSortBy] = useState("clicks");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);

  const dateIn = (iso: string) => {
    const t = new Date(iso).getTime();
    const a = from ? new Date(from).getTime() : -Infinity;
    const b = to ? new Date(to).getTime() + 24 * 3600 * 1000 - 1 : Infinity;
    return t >= a && t <= b;
  };

  // Build metrics
  const rowsAll: Row[] = useMemo(() => {
    const byAff: Record<string, Row> = {};
    const nameOf = (id: string, fallback?: string) => {
      const c = commissions.find(c => c.affiliatorId === id);
      if (c?.affiliatorName) return c.affiliatorName;
      const p = payouts.find(p => p.affiliatorId === id);
      if (p?.affiliatorName) return p.affiliatorName;
      const l = links.find(l => l.affiliatorId === id);
      return l?.affiliatorName || fallback || id;
    };

    // clicks from links (total lifetime as we don't store per-date clicks)
    links.forEach(l => {
      const aid = l.affiliatorId ?? "unknown";
      if (!byAff[aid]) byAff[aid] = { 
        affiliatorId: aid, 
        affiliatorName: nameOf(aid, "Unknown"), 
        clicks: 0, 
        conversions: 0, 
        totalCommissions: 0, 
        paidOut: 0, 
        epc: 0, 
        approvalRate: 0 
      };
      byAff[aid].clicks += l.clicks || 0;
    });

    // commissions (filter by date window)
    const commFiltered = commissions.filter(c => dateIn(c.date));
    const commTotalByAff: Record<string, number> = {};
    commFiltered.forEach(c => {
      const aid = c.affiliatorId;
      if (!byAff[aid]) byAff[aid] = { 
        affiliatorId: aid, 
        affiliatorName: nameOf(aid, "Unknown"), 
        clicks: 0, 
        conversions: 0, 
        totalCommissions: 0, 
        paidOut: 0, 
        epc: 0, 
        approvalRate: 0 
      };
      byAff[aid].totalCommissions += c.amount || 0;
      commTotalByAff[aid] = (commTotalByAff[aid] || 0) + 1;
      if (c.status === "approved" || c.status === "paid") byAff[aid].conversions += 1;
    });

    // payouts (filter by date window)
    const payoutsFiltered = payouts.filter(p => dateIn(p.date));
    payoutsFiltered.forEach(p => {
      const aid = p.affiliatorId;
      if (!byAff[aid]) byAff[aid] = { 
        affiliatorId: aid, 
        affiliatorName: nameOf(aid, "Unknown"), 
        clicks: 0, 
        conversions: 0, 
        totalCommissions: 0, 
        paidOut: 0, 
        epc: 0, 
        approvalRate: 0 
      };
      if (p.status === "paid") byAff[aid].paidOut += p.amount || 0;
    });

    // finalize computed fields
    Object.values(byAff).forEach(r => {
      r.epc = r.clicks > 0 ? r.totalCommissions / r.clicks : 0;
      const totalCommRecords = commTotalByAff[r.affiliatorId] || 0;
      r.approvalRate = totalCommRecords > 0 ? r.conversions / totalCommRecords : 0;
    });

    return Object.values(byAff);
  }, [links, commissions, payouts, from, to]);

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    let result = rowsAll.filter(r => `${r.affiliatorId} ${r.affiliatorName}`.toLowerCase().includes(t));
    
    // Sorting
    result.sort((a, b) => {
      let aVal, bVal;
      switch(sortBy) {
        case "name": 
          aVal = a.affiliatorName.toLowerCase();
          bVal = b.affiliatorName.toLowerCase();
          break;
        case "clicks": 
          aVal = a.clicks;
          bVal = b.clicks;
          break;
        case "conversions": 
          aVal = a.conversions;
          bVal = b.conversions;
          break;
        case "revenue": 
          aVal = a.totalCommissions;
          bVal = b.totalCommissions;
          break;
        case "payouts": 
          aVal = a.paidOut;
          bVal = b.paidOut;
          break;
        case "epc": 
          aVal = a.epc;
          bVal = b.epc;
          break;
        case "approval": 
          aVal = a.approvalRate;
          bVal = b.approvalRate;
          break;
        default: 
          return 0;
      }
      
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' 
          ? aVal.localeCompare(bVal as string) 
          : (bVal as string).localeCompare(aVal);
      } else {
        return sortOrder === 'asc' 
          ? (aVal as number) - (bVal as number) 
          : (bVal as number) - (aVal as number);
      }
    });
    
    return result;
  }, [rowsAll, q, sortBy, sortOrder]);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  useEffect(() => { setPage(1); }, [q, from, to, rowsAll.length, sortBy, sortOrder]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const exportCSV = () => {
    const header = ["AffiliatorID","Affiliator","Clicks","Conversions","TotalCommissions","PaidOut","EPC","ApprovalRate"];
    const rows = filtered.map(r => [
      r.affiliatorId, 
      r.affiliatorName, 
      r.clicks, 
      r.conversions, 
      r.totalCommissions.toFixed(2), 
      r.paidOut.toFixed(2), 
      r.epc.toFixed(4), 
      (r.approvalRate*100).toFixed(1)+"%"
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); 
    a.href = url; 
    a.download = `affiliator-analytics-${Date.now()}.csv`; 
    a.click(); 
    URL.revokeObjectURL(url);
    toast({ title: "Export Complete", description: `Successfully exported ${filtered.length} records to CSV` });
  };

  const totals = useMemo(() => ({
    affiliates: filtered.length,
    clicks: filtered.reduce((a,b)=>a+b.clicks,0),
    revenue: filtered.reduce((a,b)=>a+b.totalCommissions,0),
    payouts: filtered.reduce((a,b)=>a+b.paidOut,0),
  }), [filtered]);

  const clearFilters = () => {
    setQ("");
    setFrom("");
    setTo("");
    setSortBy("clicks");
    setSortOrder("desc");
  };

  const hasActiveFilters = q || from || to || sortBy !== "clicks" || sortOrder !== "desc";

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Affiliator Performance Analytics
              </h1>
              <p className="text-muted-foreground mt-1">
                Comprehensive insights into clicks, conversions, revenue, and payout metrics
              </p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Affiliators</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {totals.affiliates.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                    {totals.clicks.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-full">
                  <MousePointerClick className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500/10 to-amber-600/5 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                    ${totals.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-full">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-500/10 to-violet-600/5 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Payouts</p>
                  <p className="text-3xl font-bold text-violet-700 dark:text-violet-300">
                    ${totals.payouts.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </p>
                </div>
                <div className="p-3 bg-violet-500/10 rounded-full">
                  <DollarSign className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Controls
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  {showFilters ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
                <Button variant="default" onClick={exportCSV} size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className={`${showFilters ? "block" : "hidden lg:block"} transition-all duration-300`}>
            <div className="grid gap-6 lg:grid-cols-12">
              {/* Search */}
              <div className="lg:col-span-4">
                <Label htmlFor="search" className="text-sm font-medium mb-2 block">Search Affiliators</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search"
                    placeholder="Search by name or ID..." 
                    value={q} 
                    onChange={e=>setQ(e.target.value)} 
                    className="pl-10 border-0 bg-muted/50 focus:bg-background"
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="lg:col-span-4">
                <Label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date Range
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    type="date" 
                    value={from} 
                    onChange={e=>setFrom(e.target.value)} 
                    className="border-0 bg-muted/50 focus:bg-background text-sm"
                    placeholder="From"
                  />
                  <Input 
                    type="date" 
                    value={to} 
                    onChange={e=>setTo(e.target.value)} 
                    className="border-0 bg-muted/50 focus:bg-background text-sm"
                    placeholder="To"
                  />
                </div>
              </div>

              {/* Sort Controls */}
              <div className="lg:col-span-3">
                <Label className="text-sm font-medium mb-2 block">Sort Options</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-0 bg-muted/50">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="clicks">Clicks</SelectItem>
                      <SelectItem value="conversions">Conversions</SelectItem>
                      <SelectItem value="revenue">Revenue</SelectItem>
                      <SelectItem value="payouts">Payouts</SelectItem>
                      <SelectItem value="epc">EPC</SelectItem>
                      <SelectItem value="approval">Approval Rate</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="border-0 bg-muted/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">
                        <div className="flex items-center">
                          <SortAsc className="h-4 w-4 mr-2" />
                          Ascending
                        </div>
                      </SelectItem>
                      <SelectItem value="desc">
                        <div className="flex items-center">
                          <SortDesc className="h-4 w-4 mr-2" />
                          Descending
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="lg:col-span-1 flex items-end">
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} size="sm" className="w-full lg:w-auto">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  {q && <Badge variant="secondary">Search: {q}</Badge>}
                  {from && <Badge variant="secondary">From: {from}</Badge>}
                  {to && <Badge variant="secondary">To: {to}</Badge>}
                  {sortBy !== "clicks" && <Badge variant="secondary">Sort: {sortBy}</Badge>}
                  {sortOrder !== "desc" && <Badge variant="secondary">Order: {sortOrder}</Badge>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>Affiliator Performance Data</CardTitle>
              <div className="text-sm text-muted-foreground">
                Showing {filtered.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} results
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-4 bg-muted/20 rounded-full inline-block mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Results Found</h3>
                <p className="text-muted-foreground mb-4">
                  No affiliators match your current filters. Try adjusting your search criteria.
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                  {paginated.map(r => (
                    <Card key={r.affiliatorId} className="overflow-hidden hover:shadow-md transition-shadow border-0 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                      <CardHeader className="py-4 bg-gradient-to-r from-primary/5 to-primary/10">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{r.affiliatorName}</CardTitle>
                            <p className="text-sm text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded mt-1 inline-block">
                              {r.affiliatorId}
                            </p>
                          </div>
                          <Badge 
                            variant={r.approvalRate >= 0.8 ? "default" : r.approvalRate >= 0.5 ? "secondary" : "outline"} 
                            className="ml-2"
                          >
                            {(r.approvalRate*100).toFixed(1)}% Approval
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Clicks</div>
                            <div className="text-xl font-bold text-emerald-600">{r.clicks.toLocaleString()}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Conversions</div>
                            <div className="text-xl font-bold text-blue-600">{r.conversions.toLocaleString()}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Revenue</div>
                            <div className="text-xl font-bold text-amber-600">
                              ${r.totalCommissions.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Payouts</div>
                            <div className="text-xl font-bold text-violet-600">
                              ${r.paidOut.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </div>
                          </div>
                          <div className="col-span-2 pt-2 border-t">
                            <div className="text-xs text-muted-foreground font-medium">EPC (Earnings Per Click)</div>
                            <div className="text-xl font-bold text-primary">${r.epc.toFixed(4)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b-2">
                        <th className="py-4 px-4 font-semibold text-sm">
                          <div className="flex items-center">
                            Affiliator
                            {getSortIcon('name')}
                          </div>
                        </th>
                        <th className="py-4 px-4 font-semibold text-sm">
                          <div className="flex items-center">
                            Clicks
                            {getSortIcon('clicks')}
                          </div>
                        </th>
                        <th className="py-4 px-4 font-semibold text-sm">
                          <div className="flex items-center">
                            Conversions
                            {getSortIcon('conversions')}
                          </div>
                        </th>
                        <th className="py-4 px-4 font-semibold text-sm">
                          <div className="flex items-center">
                            Revenue
                            {getSortIcon('revenue')}
                          </div>
                        </th>
                        <th className="py-4 px-4 font-semibold text-sm">
                          <div className="flex items-center">
                            Payouts
                            {getSortIcon('payouts')}
                          </div>
                        </th>
                        <th className="py-4 px-4 font-semibold text-sm">
                          <div className="flex items-center">
                            EPC
                            {getSortIcon('epc')}
                          </div>
                        </th>
                        <th className="py-4 px-4 font-semibold text-sm">
                          <div className="flex items-center">
                            Approval Rate
                            {getSortIcon('approval')}
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((r, index) => (
                        <tr 
                          key={r.affiliatorId} 
                          className={`border-b hover:bg-muted/30 transition-colors ${
                            index % 2 === 0 ? 'bg-muted/10' : ''
                          }`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{r.affiliatorName}</span>
                              <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-0.5 rounded mt-1 inline-block w-fit">
                                {r.affiliatorId}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-medium text-emerald-600">{r.clicks.toLocaleString()}</td>
                          <td className="py-4 px-4 font-medium text-blue-600">{r.conversions.toLocaleString()}</td>
                          <td className="py-4 px-4 font-medium text-amber-600">
                            ${r.totalCommissions.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                          <td className="py-4 px-4 font-medium text-violet-600">
                            ${r.paidOut.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                          <td className="py-4 px-4 font-medium">${r.epc.toFixed(4)}</td>
                          <td className="py-4 px-4">
                            <Badge 
                              variant={r.approvalRate >= 0.8 ? "default" : r.approvalRate >= 0.5 ? "secondary" : "outline"} 
                              className="min-w-[80px] justify-center"
                            >
                              {(r.approvalRate*100).toFixed(1)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {filtered.length > pageSize && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filtered.length)} of {filtered.length} results
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        disabled={page <= 1} 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="h-9 w-9 p-0"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-1 mx-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          // Show pages around current page
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              size="sm"
                              variant={page === pageNum ? "default" : "outline"}
                              onClick={() => setPage(pageNum)}
                              className="h-9 w-9 p-0 font-medium"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        {totalPages > 5 && page < totalPages - 2 && (
                          <>
                            <span className="px-2 text-muted-foreground">...</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setPage(totalPages)}
                              className="h-9 w-9 p-0 font-medium"
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        disabled={page >= totalPages} 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        className="h-9 w-9 p-0"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}