import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TenantOrders() {
  const { tenantSlug } = useParams();
  // Dummy list
  const orders = [
    { id: "ord-1001", date: "2025-01-01", total: 49, status: "paid" },
    { id: "ord-1002", date: "2025-02-01", total: 49, status: "paid" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{tenantSlug} • Orders</h1>
          <p className="text-muted-foreground">Your tenant subscription orders (demo).</p>
        </div>
        <Link to={`/lms/${tenantSlug}/packages`}><Button variant="secondary">Change Package</Button></Link>
      </div>

      <div className="grid gap-4">
        {orders.map(o => (
          <Card key={o.id}>
            <CardHeader>
              <CardTitle>Order {o.id}</CardTitle>
              <CardDescription>{o.date} • ${o.total} • {o.status}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary">Invoice</Button>
                <Button size="sm">Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
