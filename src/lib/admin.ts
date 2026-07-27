import type { Session } from "next-auth";

/**
 * Who can see /admin. Hardcoded allowlist (matches the ClaudeMarketers pattern).
 * Add emails here; keep it short. The dev credentials user is included so the
 * dashboard is testable locally without Google OAuth.
 */
export const ADMIN_EMAILS = [
  "jonathan@growthpair.com",
  "dev@deleteslop.com",
];

export function isAdmin(session: Session | null): boolean {
  const email = session?.user?.email;
  return !!email && ADMIN_EMAILS.includes(email);
}
