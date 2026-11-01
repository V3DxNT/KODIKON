import { Role } from "@/types/soc";

export interface AuthUser {
  id: string;
  name: string;
  displayName?: string;
  email: string;
  role: Role;
  department?: string;
  clearanceLevel?: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

const DEMO_ADMIN: AuthUser = {
  id: "usr_admin_01",
  name: "Sarah Chen",
  displayName: "Sarah Chen (SecOps)",
  email: "admin@secops.local",
  role: "admin",
  department: "Security Operations",
  clearanceLevel: "Level 4 (System Admin)",
  lastLogin: "2026-11-01T00:00:00.000Z",
};

const DEMO_STAFF: AuthUser = {
  id: "usr_staff_01",
  name: "Marcus Vance",
  displayName: "Marcus Vance (Front Desk)",
  email: "staff@secops.local",
  role: "employee",
  department: "Clinical Front Desk",
  clearanceLevel: "Level 1 (General Staff)",
  lastLogin: "2026-11-01T00:00:00.000Z",
};

export async function authenticateAdmin(
  identifier: string,
  pass: string
): Promise<AuthResult> {
  // Brief simulated authentication latency
  await new Promise((r) => setTimeout(r, 120));

  const cleanIdent = identifier.trim().toLowerCase();
  const cleanPass = pass.trim();

  // Accept demo pass "admin123" or valid admin login
  if (
    cleanPass === "admin123" ||
    (cleanIdent.includes("admin") && cleanPass.length >= 4)
  ) {
    return {
      success: true,
      user: {
        ...DEMO_ADMIN,
        email: cleanIdent.includes("@") ? cleanIdent : `${cleanIdent}@secops.local`,
        name: cleanIdent.includes("admin") ? "Sarah Chen" : cleanIdent,
        displayName: cleanIdent.includes("admin") ? "Sarah Chen (SecOps)" : `${cleanIdent} (SecOps)`,
        lastLogin: "2026-11-01T00:00:00.000Z",
      },
    };
  }

  return {
    success: false,
    error: "Invalid administrator credentials. Check your username and password.",
  };
}

export async function authenticateStaff(
  identifier: string,
  pass: string
): Promise<AuthResult> {
  await new Promise((r) => setTimeout(r, 120));

  const cleanIdent = identifier.trim().toLowerCase();
  const cleanPass = pass.trim();

  // Accept demo pass "staff123" or standard credentials
  if (
    cleanPass === "staff123" ||
    cleanPass === "admin123" ||
    cleanIdent.includes("staff") ||
    cleanPass.length >= 4
  ) {
    return {
      success: true,
      user: {
        ...DEMO_STAFF,
        email: cleanIdent.includes("@") ? cleanIdent : `${cleanIdent}@secops.local`,
        name: cleanIdent.includes("staff") ? "Marcus Vance" : cleanIdent,
        displayName: cleanIdent.includes("staff") ? "Marcus Vance (Front Desk)" : `${cleanIdent} (Staff)`,
        lastLogin: "2026-11-01T00:00:00.000Z",
      },
    };
  }

  return {
    success: false,
    error: "Invalid staff credentials. Check your identifier and password.",
  };
}
