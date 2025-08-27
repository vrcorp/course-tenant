import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Invoices() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-muted-foreground mt-2">List of invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This is a placeholder page for Invoices.</p>
        </CardContent>
      </Card>
    </div>
  );
}
