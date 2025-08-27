import company from "@/data/company.json";

export const COMPANY_NAME: string = company.name || "";

export function brandify(input: string): string {
  if (!input) return input;
  // Use split/join for broad compatibility
  return input.split("VidemyHub").join(COMPANY_NAME);
}
