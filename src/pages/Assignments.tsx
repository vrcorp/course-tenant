import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Assignments() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">
          Create and manage assignments for your courses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Management</CardTitle>
          <CardDescription>
            Create, distribute, and grade assignments for your students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Assignment management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
