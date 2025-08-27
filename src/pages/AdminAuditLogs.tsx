import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import seed from "@/data/admin_audit_logs.json";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Trash2, FileText, AlertTriangle, XCircle, Info, Calendar, Filter, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function AdminAuditLogs() {
  type Log = { id: string; type: "info" | "warning" | "error"; message: string; createdAt: string };
  const [items, setItems] = useState<Log[]>([]);
  const [q, setQ] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<Log["type"]>("info");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<"all" | Log["type"]>("all");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all");

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const initial = loadArray<Log>(STORE_KEYS.auditLogs, seed as any[]);
        // sort desc by date
        initial.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setItems(initial);
        toast.success(`Loaded ${initial.length} audit logs`);
      } catch (error) {
        toast.error('Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filtered = useMemo(() => {
    let result = items;
    
    // Text search filter
    if (q) {
      const searchTerm = q.toLowerCase();
      result = result.filter(i => 
        `${i.type} ${i.message}`.toLowerCase().includes(searchTerm)
      );
    }
    
    // Type filter
    if (filterType !== "all") {
      result = result.filter(i => i.type === filterType);
    }
    
    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      result = result.filter(i => {
        const itemDate = new Date(i.createdAt);
        switch (dateFilter) {
          case "today":
            return itemDate >= today;
          case "week":
            return itemDate >= weekAgo;
          case "month":
            return itemDate >= monthAgo;
          default:
            return true;
        }
      });
    }
    
    return result;
  }, [items, q, filterType, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  useEffect(() => { setPage(1); }, [q, items.length]);

  const persist = (next: Log[]) => {
    try {
      // keep newest first
      const sorted = [...next].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setItems(sorted);
      saveArray(STORE_KEYS.auditLogs, sorted);
    } catch (error) {
      toast.error('Failed to save audit logs');
    }
  };

  const addLog = async () => {
    if (!message.trim()) {
      toast.error('Please enter a log message');
      return;
    }
    
    setSaving(true);
    try {
      const log: Log = {
        id: `log-${Date.now()}`,
        type,
        message: message.trim(),
        createdAt: new Date().toISOString(),
      };
      persist([log, ...items]);
      setMessage("");
      setOpen(false);
      toast.success(`${type.toUpperCase()} log entry added successfully`);
    } catch (error) {
      toast.error('Failed to add log entry');
    } finally {
      setSaving(false);
    }
  };

  const clear = () => {
    if (items.length === 0) {
      toast.info('No logs to clear');
      return;
    }
    
    const count = items.length;
    persist([]);
    toast.success(`Cleared ${count} log entries`);
  };
  
  const exportLogs = () => {
    try {
      const dataStr = JSON.stringify(filtered, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `audit-logs-${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success(`Exported ${filtered.length} log entries`);
    } catch (error) {
      toast.error('Failed to export logs');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading audit logs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-muted-foreground">Monitor and review system activities and events</p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Logs</p>
                  <p className="text-2xl font-bold text-blue-600">{items.length}</p>
                </div>
                <Info className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Errors</p>
                  <p className="text-2xl font-bold text-red-600">{items.filter(i => i.type === 'error').length}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Warnings</p>
                  <p className="text-2xl font-bold text-amber-600">{items.filter(i => i.type === 'warning').length}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Filtered</p>
                  <p className="text-2xl font-bold text-green-600">{filtered.length}</p>
                </div>
                <Filter className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Audit Log Entries
            </CardTitle>
            
            {/* Filters and Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  placeholder="Search logs..." 
                  className="pl-10 w-64 bg-white" 
                />
              </div>
              
              {/* Type Filter */}
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-32 bg-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Date Filter */}
              <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
                <SelectTrigger className="w-32 bg-white">
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={exportLogs}
                  disabled={filtered.length === 0}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clear} 
                  disabled={items.length === 0}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => { setMessage(""); setType("info"); setOpen(true); }} 
                  className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Log
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setMessage(""); setType("info"); } }}>
            <DialogContent className="sm:max-w-2xl rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <Plus className="h-5 w-5 text-blue-600" />
                  Add New Log Entry
                </DialogTitle>
                <DialogDescription>
                  Create a new audit log entry to track system activities and events.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="log-type">Log Type *</Label>
                  <Select value={type} onValueChange={(value: Log["type"]) => setType(value)}>
                    <SelectTrigger id="log-type" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          <span>Info</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="warning">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          <span>Warning</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="error">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>Error</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="log-message">Log Message *</Label>
                  <Textarea 
                    id="log-message" 
                    placeholder="Describe the system event, user action, or issue in detail..."
                    value={message} 
                    onChange={e => setMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a clear and detailed description of what happened.
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Preview
                  </h4>
                  <div className="flex items-center gap-3">
                    {type === "error" ? (
                      <Badge className="bg-red-600 hover:bg-red-600">ERROR</Badge>
                    ) : type === "warning" ? (
                      <Badge className="bg-amber-500 hover:bg-amber-500">WARNING</Badge>
                    ) : (
                      <Badge className="bg-blue-600 hover:bg-blue-600">INFO</Badge>
                    )}
                    <span className="text-sm text-gray-600">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    {message || "Your log message will appear here..."}
                  </p>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button 
                  onClick={addLog} 
                  disabled={saving || !message.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Log Entry
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => { setOpen(false); }} disabled={saving}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="text-center p-10">
                <div className="text-gray-400 mb-2">No audit logs</div>
                <p className="text-sm text-gray-500">Try adjusting your search or add a new log entry</p>
              </div>
            ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500 font-medium uppercase tracking-wider">
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {paginated.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {l.type === "error" ? (
                        <Badge className="bg-red-600 hover:bg-red-600">ERROR</Badge>
                      ) : l.type === "warning" ? (
                        <Badge className="bg-amber-500 hover:bg-amber-500">WARNING</Badge>
                      ) : (
                        <Badge className="bg-blue-600 hover:bg-blue-600">INFO</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 max-w-[640px] break-words">{l.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
            {filtered.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t">
                <span className="text-sm text-gray-500 mb-4 sm:mb-0">
                  Showing <span className="font-medium">{(page - 1) * pageSize + 1}</span> to {""}
                  <span className="font-medium">{Math.min(page * pageSize, filtered.length)}</span> of {""}
                  <span className="font-medium">{filtered.length}</span>
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="flex items-center gap-1">
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pn => (
                      <Button key={pn} size="sm" variant={page === pn ? "default" : "outline"} onClick={() => setPage(pn)} className="h-8 w-8 p-0">{pn}</Button>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="flex items-center gap-1">
                    Next
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
