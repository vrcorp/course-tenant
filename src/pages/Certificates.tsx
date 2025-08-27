import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Certificates() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certificates</h1>
        <p className="text-muted-foreground">
          Manage course completion certificates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificate Management</CardTitle>
          <CardDescription>
            Create and manage certificates for course completion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Certificate management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
