import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import { useToast } from "@/components/ui/use-toast";
import { Search, Download, Filter, ChevronLeft, ChevronRight, CheckCircle, XCircle, DollarSign, Clock, AlertCircle } from "lucide-react";

type AdminCommission = {
  id: string;
  date: string; // ISO
  affiliatorId: string;
  affiliatorName?: string;
  linkId: string;
  amount: number;
  status: "pending" | "approved" | "paid" | "rejected";
};

export default function AdminReports() {
  const { toast } = useToast();

  // Seed commissions with affiliatorId
  const seed: AdminCommission[] = [
    { id: "AC-9001", date: new Date(Date.now() - 86400000 * 5).toISOString(), affiliatorId: "A-100", affiliatorName: "Alice", linkId: "L-1001", amount: 12.5, status: "approved" },
    { id: "AC-9002", date: new Date(Date.now() - 86400000 * 3).toISOString(), affiliatorId: "A-200", affiliatorName: "Bob", linkId: "L-1002", amount: 19.0, status: "pending" },
    { id: "AC-9003", date: new Date(Date.now() - 86400000 * 1).toISOString(), affiliatorId: "A-100", affiliatorName: "Alice", linkId: "L-1003", amount: 8.75, status: "paid" },
  ];
  const [rows, setRows] = useState<AdminCommission[]>(() => loadArray(STORE_KEYS.affiliateCommissions, seed as any));
  useEffect(() => saveArray(STORE_KEYS.affiliateCommissions, rows as any), [rows]);

  // Filters
  const [q, setQ] = useState("");
  const [aff, setAff] = useState("all");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const affiliators = useMemo(() => {
    const set = new Map<string, string>();
    rows.forEach(r => set.set(r.affiliatorId, r.affiliatorName || r.affiliatorId));
    return Array.from(set.entries()).map(([id, name]) => ({ id, name }));
  }, [rows]);

  const filtered = useMemo(() => {
    const fromTs = from ? new Date(from).getTime() : -Infinity;
    const toTs = to ? new Date(to).getTime() + 24 * 3600 * 1000 - 1 : Infinity;
    return rows.filter(r => {
      const t = new Date(r.date).getTime();
      if (t < fromTs || t > toTs) return false;
      if (aff !== "all" && r.affiliatorId !== aff) return false;
      if (status !== "all" && r.status !== status) return false;
      if (q.trim()) {
        const hay = `${r.id} ${r.affiliatorId} ${r.affiliatorName ?? ""} ${r.linkId} ${r.amount} ${r.status}`.toLowerCase();
        if (!hay.includes(q.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [rows, q, aff, status, from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => { setPage(1); }, [q, status, aff, from, to]);

  const summary = useMemo(() => ({
    count: filtered.length,
    amount: filtered.reduce((a, b) => a + b.amount, 0),
    paid: filtered.filter(r => r.status === "paid").reduce((a, b) => a + b.amount, 0),
    pending: filtered.filter(r => r.status === "pending").length,
  }), [filtered]);

  const updateRowStatus = (id: string, s: AdminCommission["status"]) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, status: s } : r));
    toast({ 
      title: "Status Updated", 
      description: `Commission ${id} has been marked as ${s}`,
    });
  };

  const exportCSV = () => {
    const header = ["ID", "Date", "AffiliatorID", "Affiliator", "LinkID", "Amount", "Status"];
    const data = filtered.map(r => [r.id, new Date(r.date).toISOString(), r.affiliatorId, r.affiliatorName ?? "", r.linkId, r.amount.toFixed(2), r.status]);
    const csv = [header, ...data].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `affiliate-reports-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast({ 
      title: "Export Successful", 
      description: `${filtered.length} commission records exported to CSV`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending": 
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case "approved": 
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case "paid": 
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200"><DollarSign className="h-3 w-3 mr-1" /> Paid</Badge>;
      case "rejected": 
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default: 
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const clearFilters = () => {
    setQ("");
    setAff("all");
    setStatus("all");
    setFrom("");
    setTo("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Affiliate Commission Reports</h1>
        <p className="text-muted-foreground mt-2">Manage and review affiliate commission records</p>
      </div>

      <div className="px-2 space-y-2">
        {/* Filters Card */}
        <Card className="shadow-lg border-0 rounded-xl w-full">
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
                  placeholder="Search commissions..." 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  className="pl-10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-sm">From Date</Label>
                  <Input 
                    type="date" 
                    value={from} 
                    onChange={e => setFrom(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">To Date</Label>
                  <Input 
                    type="date" 
                    value={to} 
                    onChange={e => setTo(e.target.value)} 
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  Clear Filters
                </Button>
                <Button onClick={exportCSV} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
          <Card className="shadow-lg border-0 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader className="pb-2">
              <CardDescription>Total Commissions</CardDescription>
              <CardTitle className="text-2xl">${summary.amount.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-blue-600">
                <DollarSign className="h-4 w-4 mr-1" />
                {summary.count} records
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader className="pb-2">
              <CardDescription>Paid Amount</CardDescription>
              <CardTitle className="text-2xl">${summary.paid.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="h-4 w-4 mr-1" />
                {filtered.filter(r => r.status === "paid").length} paid
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100">
            <CardHeader className="pb-2">
              <CardDescription>Pending Approval</CardDescription>
              <CardTitle className="text-2xl">{summary.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-amber-600">
                <Clock className="h-4 w-4 mr-1" />
                Needs review
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
            <CardHeader className="pb-2">
              <CardDescription>Filtered Results</CardDescription>
              <CardTitle className="text-2xl">{filtered.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-purple-600">
                <Filter className="h-4 w-4 mr-1" />
                Matching current filters
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results Table */}
      <Card className="mt-6 shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Commission Records</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Showing {paginated.length} of {filtered.length} results</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center p-10">
              <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500">No commissions found</h3>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-sm text-gray-500 font-medium uppercase tracking-wider">
                      <th className="px-6 py-4">ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Affiliator</th>
                      <th className="px-6 py-4">Link ID</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginated.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{r.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(r.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">{r.affiliatorName || r.affiliatorId}</div>
                            <div className="text-sm text-muted-foreground">ID: {r.affiliatorId}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="font-mono text-xs">
                            {r.linkId}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          ${r.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(r.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            {r.status !== "approved" && r.status !== "paid" && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => updateRowStatus(r.id, "approved")}
                                className="h-8 text-xs"
                              >
                                Approve
                              </Button>
                            )}
                            {r.status !== "paid" && (
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                onClick={() => updateRowStatus(r.id, "paid")}
                                className="h-8 text-xs"
                              >
                                Mark Paid
                              </Button>
                            )}
                            {r.status !== "rejected" && (
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => updateRowStatus(r.id, "rejected")}
                                className="h-8 text-xs"
                              >
                                Reject
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="block md:hidden divide-y divide-gray-200">
                {paginated.map((r) => (
                  <div key={r.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Commission ID</div>
                        <div className="font-semibold">{r.id}</div>
                      </div>
                      {getStatusBadge(r.status)}
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-muted-foreground">Date</div>
                        <div className="text-sm">{new Date(r.date).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Amount</div>
                        <div className="font-medium">${r.amount.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Affiliator</div>
                        <div className="text-sm">{r.affiliatorName || r.affiliatorId}</div>
                        <div className="text-xs text-muted-foreground">ID: {r.affiliatorId}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Link ID</div>
                        <Badge variant="outline" className="font-mono text-[10px]">
                          {r.linkId}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 justify-end">
                      {r.status !== "approved" && r.status !== "paid" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => updateRowStatus(r.id, "approved")}
                          className="h-8 text-xs"
                        >
                          Approve
                        </Button>
                      )}
                      {r.status !== "paid" && (
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          onClick={() => updateRowStatus(r.id, "paid")}
                          className="h-8 text-xs"
                        >
                          Mark Paid
                        </Button>
                      )}
                      {r.status !== "rejected" && (
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => updateRowStatus(r.id, "rejected")}
                          className="h-8 text-xs"
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg">
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
  );
}