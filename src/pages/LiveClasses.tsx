import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LiveClasses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Classes</h1>
        <p className="text-muted-foreground">
          Manage and participate in live classes
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Classes</CardTitle>
          <CardDescription>
            Schedule and manage live classes for your courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Live classes functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
