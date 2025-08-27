import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Eye, 
  Download, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  Server,
  FileText,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import seedOrders from "@/data/admin_orders.json";
import { loadArray, saveArray, STORE_KEYS } from "@/lib/dataStore";
import users from "@/data/users.json";
import { getRole } from "@/lib/auth";

export default function MyOrders() {
  const [activeTab, setActiveTab] = useState("all");
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  const role = getRole();
  const currentUser: any | null = role === "user" ? (users as any[])[0] : null; // demo: first user
  const allOrders = useMemo(() => loadArray<any>(STORE_KEYS.orders, seedOrders as any[]), []);
  const myOrders = useMemo(() => allOrders.filter(o => o.userId === currentUser?.id), [allOrders, currentUser]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      processing: "outline"
    } as const;
    
    const labels = {
      completed: "Selesai",
      pending: "Pending",
      failed: "Gagal",
      processing: "Diproses"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const filterOrders = (key: string) => {
    switch (key) {
      case "paid":
        return myOrders.filter(o => o.status === "paid");
      case "pending":
        return myOrders.filter(o => o.status === "pending");
      case "video":
        return myOrders.filter(o => o.type === "video_hosting");
      case "lms":
        return myOrders.filter(o => o.type === "lms");
      case "all":
      default:
        return myOrders;
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleDownloadInvoice = (order: any) => {
    toast.success(`Generating PDF invoice for Order #${order.id}...`);
    
    // Generate professional PDF invoice
    generatePDFInvoice(order);
  };

  const generatePDFInvoice = (order: any) => {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to download the invoice');
      return;
    }

    const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice #${order.id}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
        }
        .invoice-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          background: white;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #8b5cf6;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #8b5cf6;
        }
        .invoice-info {
          text-align: right;
        }
        .invoice-title {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .invoice-number {
          font-size: 16px;
          color: #6b7280;
          margin-bottom: 5px;
        }
        .invoice-date {
          font-size: 14px;
          color: #6b7280;
        }
        .billing-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        .billing-info {
          flex: 1;
        }
        .billing-title {
          font-size: 16px;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 10px;
        }
        .company-info {
          color: #6b7280;
          font-size: 14px;
        }
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          margin-top: 10px;
        }
        .status-paid {
          background: #dcfce7;
          color: #166534;
        }
        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }
        .status-cancelled {
          background: #fee2e2;
          color: #991b1b;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        .items-table th {
          background: #f9fafb;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }
        .items-table td {
          padding: 15px;
          border-bottom: 1px solid #e5e7eb;
        }
        .item-description {
          font-weight: 500;
          color: #1f2937;
        }
        .item-details {
          font-size: 13px;
          color: #6b7280;
          margin-top: 4px;
        }
        .totals-section {
          margin-left: auto;
          width: 300px;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .total-row.final {
          border-bottom: 2px solid #8b5cf6;
          font-weight: bold;
          font-size: 18px;
          color: #1f2937;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
        .thank-you {
          font-size: 16px;
          font-weight: 500;
          color: #8b5cf6;
          margin-bottom: 10px;
        }
        @media print {
          body { margin: 0; }
          .invoice-container { padding: 20px; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <!-- Header -->
        <div class="header">
          <div class="logo">Videmy Hub</div>
          <div class="invoice-info">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">#${order.id}</div>
            <div class="invoice-date">${formatDate(order.createdAt)}</div>
            <div class="status-badge status-${order.status}">${order.status.toUpperCase()}</div>
          </div>
        </div>

        <!-- Billing Information -->
        <div class="billing-section">
          <div class="billing-info">
            <div class="billing-title">Bill To:</div>
            <div class="company-info">
              ${currentUser?.name || 'Customer'}<br>
              ${currentUser?.email || 'customer@example.com'}<br>
              ${currentUser?.phone || '+62 xxx-xxx-xxxx'}<br>
            </div>
          </div>
          <div class="billing-info">
            <div class="billing-title">From:</div>
            <div class="company-info">
              Videmy Hub<br>
              Jakarta, Indonesia<br>
              support@videmyhub.com<br>
              +62 21-xxxx-xxxx
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="width: 100px; text-align: center;">Qty</th>
              <th style="width: 150px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div class="item-description">
                  ${order.type === 'video_hosting' ? 'Video Hosting Package' : 'LMS Package'}
                </div>
                <div class="item-details">
                  ${order.type === 'video_hosting' 
                    ? 'Professional video hosting with advanced streaming features, analytics, and custom player'
                    : 'Complete Learning Management System with custom domain, unlimited courses, and student management'
                  }
                </div>
              </td>
              <td style="text-align: center;">1</td>
              <td style="text-align: right;">${formatPrice(order.amount)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div class="totals-section">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatPrice(order.amount)}</span>
          </div>
          <div class="total-row">
            <span>Tax (0%):</span>
            <span>${formatPrice(0)}</span>
          </div>
          <div class="total-row final">
            <span>Total:</span>
            <span>${formatPrice(order.amount)}</span>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="thank-you">Thank you for your business!</div>
          <div>
            This invoice was generated on ${new Date().toLocaleDateString('id-ID', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div style="margin-top: 10px;">
            For support, please contact us at support@videmyhub.com
          </div>
        </div>
      </div>

      <script>
        // Auto print when page loads
        window.onload = function() {
          setTimeout(function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          }, 500);
        };
      </script>
    </body>
    </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  const handlePayNow = async (order: any) => {
    setIsProcessingPayment(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update order status
      const updatedOrder = { ...order, status: 'paid', paidAt: new Date().toISOString() };
      const updatedOrders = allOrders.map(o => o.id === order.id ? updatedOrder : o);
      saveArray(STORE_KEYS.orders, updatedOrders);
      
      toast.success(`Payment successful for Order #${order.id}!`);
      
      // Refresh the page data
      window.location.reload();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = allOrders.map(o => 
      o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
    );
    saveArray(STORE_KEYS.orders, updatedOrders);
    toast.success(`Order #${orderId} status updated to ${newStatus}`);
  };

  const paidOrders = filterOrders("paid");
  const pendingOrders = filterOrders("pending");
  const videoOrders = filterOrders("video");
  const lmsOrders = filterOrders("lms");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground mt-2">Riwayat pesanan untuk Video Hosting dan LMS</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-primary" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{myOrders.length}</p>
                <p className="text-xs text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Server className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{videoOrders.length}</p>
                <p className="text-xs text-muted-foreground">Video Hosting</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{lmsOrders.length}</p>
                <p className="text-xs text-muted-foreground">LMS</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-2xl font-bold">{pendingOrders.length}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Semua ({myOrders.length})</TabsTrigger>
          <TabsTrigger value="video">Video Hosting ({videoOrders.length})</TabsTrigger>
          <TabsTrigger value="lms">LMS ({lmsOrders.length})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paidOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filterOrders("all").map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onViewDetails={handleViewDetails}
                onDownloadInvoice={handleDownloadInvoice}
                onPayNow={handlePayNow}
                isProcessingPayment={isProcessingPayment}
                onChange={(next) => {
                  const updated = allOrders.map(o => o.id === next.id ? next : o);
                  saveArray(STORE_KEYS.orders, updated);
                }} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="video" className="mt-6">
          <div className="space-y-4">
            {videoOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onViewDetails={handleViewDetails}
                onDownloadInvoice={handleDownloadInvoice}
                onPayNow={handlePayNow}
                isProcessingPayment={isProcessingPayment}
                onChange={(next) => {
                  const updated = allOrders.map(o => o.id === next.id ? next : o);
                  saveArray(STORE_KEYS.orders, updated);
                }} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lms" className="mt-6">
          <div className="space-y-4">
            {lmsOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onViewDetails={handleViewDetails}
                onDownloadInvoice={handleDownloadInvoice}
                onPayNow={handlePayNow}
                isProcessingPayment={isProcessingPayment}
                onChange={(next) => {
                  const updated = allOrders.map(o => o.id === next.id ? next : o);
                  saveArray(STORE_KEYS.orders, updated);
                }} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="paid" className="mt-6">
          <div className="space-y-4">
            {paidOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onViewDetails={handleViewDetails}
                onDownloadInvoice={handleDownloadInvoice}
                onPayNow={handlePayNow}
                isProcessingPayment={isProcessingPayment}
                onChange={(next) => {
                  const updated = allOrders.map(o => o.id === next.id ? next : o);
                  saveArray(STORE_KEYS.orders, updated);
                }} 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onViewDetails={handleViewDetails}
                onDownloadInvoice={handleDownloadInvoice}
                onPayNow={handlePayNow}
                isProcessingPayment={isProcessingPayment}
                onChange={(next) => {
                  const updated = allOrders.map(o => o.id === next.id ? next : o);
                  saveArray(STORE_KEYS.orders, updated);
                }} 
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Order Details - #{selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>
              Complete information about your order
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {selectedOrder.status === 'paid' ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : selectedOrder.status === 'pending' ? (
                    <Clock className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <div>
                    <p className="font-semibold">Order Status</p>
                    <p className="text-sm text-muted-foreground capitalize">{selectedOrder.status}</p>
                  </div>
                </div>
                <Badge variant={selectedOrder.status === 'paid' ? 'default' : selectedOrder.status === 'pending' ? 'secondary' : 'destructive'}>
                  {selectedOrder.status}
                </Badge>
              </div>

              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Order ID</label>
                    <p className="font-mono">{selectedOrder.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Order Type</label>
                    <p className="flex items-center gap-2">
                      {selectedOrder.type === 'video_hosting' ? (
                        <><Server className="h-4 w-4" /> Video Hosting</>
                      ) : (
                        <><Package className="h-4 w-4" /> LMS Package</>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Amount</label>
                    <p className="text-lg font-semibold">{formatPrice(selectedOrder.amount)}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Order Date</label>
                    <p>{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                  {selectedOrder.paidAt && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Payment Date</label>
                      <p>{formatDate(selectedOrder.paidAt)}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Payment Method</label>
                    <p>{selectedOrder.paymentMethod || 'Credit Card'}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Package Details */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Package Details
                </h4>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="font-medium">{selectedOrder.packageName || (selectedOrder.type === 'video_hosting' ? 'Video Hosting Package' : 'LMS Package')}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedOrder.type === 'video_hosting' 
                      ? 'Professional video hosting with advanced features'
                      : 'Complete Learning Management System with custom domain'
                    }
                  </p>
                </div>
              </div>

              {/* Order Timeline */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Order Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-muted-foreground">Order created:</span>
                    <span>{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  {selectedOrder.status === 'paid' && selectedOrder.paidAt && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-muted-foreground">Payment completed:</span>
                      <span>{formatDate(selectedOrder.paidAt)}</span>
                    </div>
                  )}
                  {selectedOrder.status === 'paid' && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-muted-foreground">Service activated:</span>
                      <span>{formatDate(selectedOrder.paidAt || selectedOrder.createdAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
              Close
            </Button>
            {selectedOrder && (
              <>
                <Button variant="outline" onClick={() => handleDownloadInvoice(selectedOrder)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
                {selectedOrder.status === 'paid' && selectedOrder.type === 'lms' && (
                  <Button onClick={() => window.open(`/t/${selectedOrder.tenantSlug || 'demo'}`, '_blank')}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Access LMS
                  </Button>
                )}
                {selectedOrder.status === 'paid' && selectedOrder.type === 'video_hosting' && (
                  <Button onClick={() => window.location.href = '/videos'}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Manage Videos
                  </Button>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OrderCard({ 
  order, 
  onChange, 
  onViewDetails, 
  onDownloadInvoice, 
  onPayNow, 
  isProcessingPayment 
}: { 
  order: any; 
  onChange: (next: any) => void;
  onViewDetails: (order: any) => void;
  onDownloadInvoice: (order: any) => void;
  onPayNow: (order: any) => Promise<void>;
  isProcessingPayment: boolean;
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      processing: "outline"
    } as const;
    
    const labels = {
      completed: "Selesai",
      pending: "Pending",
      failed: "Gagal",
      processing: "Diproses"
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
            <CardDescription className="mt-1">{order.type === "video_hosting" ? "Video Hosting" : "LMS"} • {formatDate(order.createdAt)}</CardDescription>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Order Summary */}
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="font-semibold">Amount</span>
            <span className="font-semibold text-lg">{formatPrice(order.amount)}</span>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => onViewDetails(order)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDownloadInvoice(order)}>
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
            {order.status === "pending" && (
              <Button 
                size="sm" 
                onClick={() => onPayNow(order)}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay Now
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}