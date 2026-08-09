"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { isSafeRelativePath } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string | null;
  emailVerified?: boolean;
  provider?: string;
  hasPassword?: boolean;
  role?: string; // "client" | "admin"
  company?: string | null;
}

interface AuthResult {
  success: boolean;
  message?: string;
  needsVerification?: boolean;
  /** Machine-readable error code (e.g. "EMAIL_NOT_VERIFIED"). */
  code?: string;
  /** The submitted email, echoed back so a resend can target it. */
  email?: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** True when the signed-in user has the "admin" role. */
  isAdmin: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  /** Finish an OAuth sign-in: the session cookie is already set by the server,
   *  so we hydrate the user via /api/auth/me and redirect. */
  completeOAuth: (next?: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Session auth uses an httpOnly cookie set by the server — the browser sends
 * it automatically, so the client never holds the token (no localStorage, no
 * XSS token theft). On mount we hydrate the user from /api/auth/me.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore the session from the httpOnly cookie on mount.
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) setUser(data.user);
      })
      .catch(() => {
        // Network error — treat as not logged in; a retry happens on reload.
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string, rememberMe = true): Promise<AuthResult> => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, rememberMe }),
        });

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
          return { success: true };
        }

        return {
          success: false,
          message: data.message || "Login failed",
          code: data.code,
          email: data.email,
        };
      } catch {
        return { success: false, message: "Network error. Please try again." };
      }
    },
    []
  );

  const signup = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (data.success) {
          // With verification enabled the API issues no session — the user must
          // confirm their email first. In dev (no email provider) the server
          // sets a session cookie, so we can hydrate the user immediately.
          if (data.user && !data.needsVerification) setUser(data.user);
          return {
            success: true,
            needsVerification: !!data.needsVerification,
          };
        }

        return {
          success: false,
          message:
            data.message ||
            (data.errors
              ? Object.values(data.errors ?? {}).flat().join(", ")
              : "Registration failed"),
        };
      } catch {
        return { success: false, message: "Network error. Please try again." };
      }
    },
    []
  );

  const logout = useCallback(() => {
    // Best-effort: expire the httpOnly cookie server-side, then clear state.
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    setUser(null);
    router.push("/");
  }, [router]);

  /** Re-fetch the current user (after profile/email changes). */
  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success && data.user) setUser(data.user);
    } catch {
      // Keep whatever we have; a network blip shouldn't clear the session.
    }
  }, []);

  /** Finish an OAuth sign-in. The server set the session cookie, so just
   *  hydrate the user and redirect. */
  const completeOAuth = useCallback(
    async (next?: string | null) => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.user) setUser(data.user);
      } catch {
        // Keep the redirect moving even if hydration fails; the shell will
        // gate on /me again.
      }
      router.replace(isSafeRelativePath(next) ? next : "/dashboard");
    },
    [router]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        signup,
        logout,
        refreshUser,
        completeOAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth state and actions.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
