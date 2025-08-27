import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Forum() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Forum</h1>
        <p className="text-muted-foreground mt-2">Community discussions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discussion Board</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This is a placeholder page for Forum.</p>
        </CardContent>
      </Card>
    </div>
  );
}
