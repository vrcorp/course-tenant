export type Role = "guest" | "user" | "instructor" | "admin" | "super_admin" | "affiliator";

const ROLE_KEY = "vh_role";

export function getRole(): Role {
  if (typeof window === "undefined") return "guest";
  const r = (localStorage.getItem(ROLE_KEY) || "guest") as Role;
  return r;
}

export function setRole(role: Role) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
  // Notify current tab listeners immediately
  try {
    window.dispatchEvent(new CustomEvent("vh_role_change", { detail: { role } }));
  } catch {}
}

export function clearRole() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ROLE_KEY);
  // Notify current tab listeners immediately
  try {
    window.dispatchEvent(new CustomEvent("vh_role_change", { detail: { role: "guest" as Role } }));
  } catch {}
}
