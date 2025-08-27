import { useParams } from "react-router-dom";
import tenants from "@/data/tenants.json";
import tenantCourses from "@/data/tenant_courses.json";

export default function TenantLanding() {
  const { tenantSlug } = useParams();
  const tenant = (tenants as any[]).find((t) => t.slug === tenantSlug || t.domain?.value?.startsWith(String(tenantSlug)));

  if (!tenant) {
    return (
      <div className="py-10">
        <h1 className="text-2xl font-bold">Tenant tidak ditemukan</h1>
        <p className="text-muted-foreground">Periksa kembali alamat subdomain/custom domain Anda.</p>
      </div>
    );
  }

  const coursesEntry = (tenantCourses as any[]).find((c) => c.tenantId === tenant.id);
  const courses = coursesEntry?.courses || [];

  return (
    <div className="py-10">
      <div className="flex items-center gap-4 mb-8">
        {tenant.branding?.logo && (
          <img src={tenant.branding.logo} alt={tenant.name} className="h-10" />
        )}
        <div>
          <h1 className="text-3xl font-extrabold">{tenant.name}</h1>
          <p className="text-sm text-muted-foreground">
            {tenant.domain?.type === "custom" ? tenant.domain.value : `${tenant.slug}.videmyhub.io`}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Kursus Unggulan</h2>
      {courses.length === 0 ? (
        <div className="rounded-xl border border-border p-6 text-muted-foreground">Belum ada kursus untuk tenant ini.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c: any) => (
            <div key={c.id} className="rounded-xl border border-border bg-card overflow-hidden">
              <img src={c.thumbnail} alt={c.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="font-semibold">{c.title}</div>
                <div className="mt-1 text-primary font-bold">${c.price}</div>
                <button className="mt-3 inline-flex items-center rounded-md bg-primary text-primary-foreground px-3 py-2 text-sm hover:opacity-90">
                  Lihat Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
