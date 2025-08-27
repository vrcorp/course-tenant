import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import lmsPackages from "@/data/lms_packages.json";
import { useParams, Link } from "react-router-dom";

export default function TenantPackages() {
  const { tenantSlug } = useParams();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{tenantSlug} • Packages</h1>
          <p className="text-muted-foreground">Choose a package for this tenant (demo view).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(lmsPackages as any[]).map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <CardDescription>Students: {p.limits?.students ?? p.students} • Courses: {p.limits?.courses ?? p.courses}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="font-semibold">${p.price_per_month ?? p.pricePerMonth}/mo</div>
              <Link to={`/lms/${tenantSlug}/cart`}><Button>Select</Button></Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
