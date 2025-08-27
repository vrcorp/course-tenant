import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";

export default function TenantCart() {
  const { tenantSlug } = useParams();
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{tenantSlug} • Cart</h1>
        <p className="text-muted-foreground">Demo cart for tenant package checkout.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Selected package and voucher (simulation)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>Selected Package</div>
            <div className="font-semibold">$49/mo</div>
          </div>
          <div className="flex items-center justify-between">
            <div>Voucher</div>
            <div className="font-semibold">- $0</div>
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <div>Total</div>
            <div className="font-bold">$49/mo</div>
          </div>
          <div className="flex gap-2 justify-end">
            <Link to={`/lms/${tenantSlug}/packages`}><Button variant="secondary">Back</Button></Link>
            <Link to={`/lms/${tenantSlug}/orders`}><Button>Checkout</Button></Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
