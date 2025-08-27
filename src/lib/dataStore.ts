// Simple client-side data store for CRUD pages.
// Loads initial data from provided seed JSON and persists modifications to localStorage.
// This simulates JSON-backed data that can be read by any page in the app.

const NS = "vh_store"; // namespace

function keyFor(id: string) {
  return `${NS}:${id}`;
}

export function loadArray<T = any>(id: string, seed: T[]): T[] {
  try {
    const s = localStorage.getItem(keyFor(id));
    if (s) {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed as T[];
    }
  } catch {
    // ignore
  }
  return Array.isArray(seed) ? seed : [];
}

export function saveArray<T = any>(id: string, data: T[]): void {
  try {
    localStorage.setItem(keyFor(id), JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function loadObject<T = any>(id: string, seed: T): T {
  try {
    const s = localStorage.getItem(keyFor(id));
    if (s) {
      const parsed = JSON.parse(s);
      if (parsed && typeof parsed === "object") return parsed as T;
    }
  } catch {
    // ignore
  }
  return seed;
}

export function saveObject<T = any>(id: string, data: T): void {
  try {
    localStorage.setItem(keyFor(id), JSON.stringify(data));
  } catch {
    // ignore
  }
}

export const STORE_KEYS = {
  vouchers: "admin_vouchers",
  users: "admin_users",
  orders: "admin_orders",
  vhPackages: "video_hosting_packages",
  lmsPackages: "lms_packages",
  siteSettings: "site_settings",
  apiSettings: "api_settings",
  tenants: "tenants",
  apiKeys: "api_keys",
  globalConfig: "global_config",
  auditLogs: "audit_logs",
  tenantAdmins: "tenant_admins",
  affiliateLinks: "affiliate_links",
  affiliateCommissions: "affiliate_commissions",
  affiliatePayouts: "affiliate_payouts",
  affiliateAssets: "affiliate_assets",
} as const;
