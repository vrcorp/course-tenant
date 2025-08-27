import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, Link } from "react-router-dom";

export default function TenantRegister() {
  const { tenantSlug } = useParams();
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{tenantSlug} • Register</h1>
        <p className="text-muted-foreground">Create your account for this tenant.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Quick stub for per-tenant registration.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your Name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full">Create Account</Button>
          <div className="text-sm text-center text-muted-foreground">
            Already have an account? <Link to={`/lms/${tenantSlug}/login`} className="underline">Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
