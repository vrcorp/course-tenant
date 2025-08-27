import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Affiliator() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Affiliator</h1>
        <p className="text-muted-foreground mt-2">Your affiliate dashboard</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This is a placeholder page for Affiliator area (/affiliatr).</p>
        </CardContent>
      </Card>
    </div>
  );
}
