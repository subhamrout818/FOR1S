"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2, MailCheck } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Confirm that you own this email address to finish verification.");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("token") ?? "";
    setToken(value);
    if (!value) setError("This verification link is missing its token. Request a new email.");
  }, []);

  const confirm = async () => {
    if (!token || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setError(result.message || "This link could not be verified.");
        return;
      }
      setDone(true);
      setMessage(result.message || "Your email address is verified. You can sign in.");
      window.history.replaceState({}, "", "/verify-email");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-5 py-16">
      <meta name="referrer" content="no-referrer" />
      <section className="w-full max-w-lg rounded-2xl border border-hairline bg-background/70 p-8 text-center shadow-2xl sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-hairline bg-background">
          {done ? <CheckCircle2 className="text-emerald-400" size={26} /> : error ? <AlertCircle className="text-red-400" size={26} /> : <MailCheck className="text-accent" size={26} />}
        </div>
        <p className="font-mono text-xs tracking-widest text-accent">FOR1S · EMAIL SECURITY</p>
        <h1 className="mt-3 font-display text-2xl font-semibold text-foreground">{done ? "Email confirmed" : "Confirm your email"}</h1>
        <p className="mt-3 text-sm leading-6 text-muted">{message}</p>
        {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
        {!done && !error && (
          <MagneticButton onClick={confirm} disabled={!token || busy} variant="solid" size="lg" className="mt-7 w-full">
            {busy ? <><Loader2 size={16} className="animate-spin" /> Confirming…</> : "Confirm email address"}
          </MagneticButton>
        )}
        {(done || error) && (
          <Link href="/login" className="mt-7 inline-flex text-sm text-foreground underline underline-offset-4 hover:text-accent">Continue to sign in</Link>
        )}
        {error && <p className="mt-4 text-xs text-muted">If the link expired, request a fresh verification email from the sign-in page.</p>}
      </section>
    </main>
  );
}
