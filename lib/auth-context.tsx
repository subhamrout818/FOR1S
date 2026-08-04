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
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** True when the signed-in user has the "admin" role. */
  isAdmin: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthResult>;
  signup: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  completeOAuth: (token: string, next?: string | null) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "for1s_token";

/**
 * Retrieve the stored token synchronously (for immediate reads).
 */
function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = getStoredToken();
    if (!stored) {
      setIsLoading(false);
      return;
    }

    setToken(stored);

    fetch("/api/auth/me", {
      headers: { authorization: `Bearer ${stored}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          // Token invalid — clear it
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
        }
      })
      .catch(() => {
        // Network error — keep the token, user stays logged in if valid
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
          localStorage.setItem(TOKEN_KEY, data.token);
          setToken(data.token);
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
          // With verification enabled the API issues no token — the user must
          // confirm their email first. In dev (no email provider) it returns
          // a token so the old auto-login behavior still works.
          if (data.token) {
            localStorage.setItem(TOKEN_KEY, data.token);
            setToken(data.token);
            setUser(data.user);
          }
          return {
            success: true,
            needsVerification: !!data.needsVerification,
          };
        }

        return {
          success: false,
          message: data.message || data.errors
            ? Object.values(data.errors ?? {}).flat().join(", ")
            : "Registration failed",
        };
      } catch {
        return { success: false, message: "Network error. Please try again." };
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    router.push("/");
  }, [router]);

  /** Re-fetch the current user (after profile/email changes). */
  const refreshUser = useCallback(async () => {
    const stored = getStoredToken();
    if (!stored) return;
    try {
      const res = await fetch("/api/auth/me", {
        headers: { authorization: `Bearer ${stored}` },
      });
      const data = await res.json();
      if (data.success && data.user) setUser(data.user);
    } catch {
      // Keep whatever we have; a network blip shouldn't clear the session.
    }
  }, []);

  /** Finish an OAuth sign-in: store the token, load the user, redirect. */
  const completeOAuth = useCallback(
    async (incomingToken: string, next?: string | null) => {
      localStorage.setItem(TOKEN_KEY, incomingToken);
      setToken(incomingToken);
      try {
        const res = await fetch("/api/auth/me", {
          headers: { authorization: `Bearer ${incomingToken}` },
        });
        const data = await res.json();
        if (data.success && data.user) setUser(data.user);
      } catch {
        // Keep the token; the next /me call will hydrate the user.
      }
      router.replace(isSafeRelativePath(next) ? next : "/dashboard");
    },
    [router]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
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
