import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Products() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground mt-2">Manage products</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This is a placeholder page for Products.</p>
        </CardContent>
      </Card>
    </div>
  );
}
