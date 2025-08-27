import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Quizzes() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quizzes</h1>
        <p className="text-muted-foreground">
          Create and manage quizzes for your courses
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Management</CardTitle>
          <CardDescription>
            Create, edit, and manage quizzes for course assessments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Quiz management functionality will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
