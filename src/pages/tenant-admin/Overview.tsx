import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import users from "@/data/users.json";

export default function TenantAdminOverview() {
  const currentUser: any = (users as any[])[0];
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Tenant Admin · Overview</h1>
        <p className="text-muted-foreground text-sm">Ringkasan tenant dan paket aktif</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Tenant</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm">Slug: <span className="font-medium">{currentUser?.tenantSlug || "—"}</span></div>
            <div className="text-sm">Paket: <span className="font-medium">{currentUser?.subscription}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>LMS Usage</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm">Students: 142</div>
            <div className="text-sm">Courses: 28</div>
            <div className="text-sm">Instructors: 6</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Status</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm">Domain: {currentUser?.tenantSlug}.videmyhub.com</div>
            <div className="text-sm">Renewal: 27 days</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
