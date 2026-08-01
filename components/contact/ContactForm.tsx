"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import MagneticButton from "@/components/ui/MagneticButton";
import { Check, ChevronDown, Loader2, Send } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Form field primitives (labels programmatically tied to controls)   */
/* ------------------------------------------------------------------ */

const inputClasses = cn(
  "w-full rounded-xl border border-hairline bg-background px-4 py-3",
  "text-sm text-foreground placeholder:text-muted",
  "transition-all duration-300",
  "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50",
  "hover:border-foreground/20"
);

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({
  id,
  name,
  value,
  onChange,
  placeholder,
  options,
  error,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
  error?: string;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          inputClasses,
          "appearance-none pr-10",
          !value && "text-muted",
          error && "border-red-400/50"
        )}
      >
        <option value="" disabled className="bg-surface text-muted">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-surface text-foreground">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Options                                                            */
/* ------------------------------------------------------------------ */

const PROJECT_TYPES = [
  "SaaS Platform",
  "Business Website",
  "Landing Page",
  "Video / Commercial",
  "Something else",
];

const BUDGETS = [
  "Under $2,500",
  "$2,500 – $5,000",
  "$5,000 – $12,000",
  "$12,000+",
  "Not sure yet",
];

/* ------------------------------------------------------------------ */
/*  Form                                                               */
/* ------------------------------------------------------------------ */

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [general, setGeneral] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGeneral("");
    setErrors({});

    if (form.message.trim().length < 10) {
      setErrors({ message: "Message must be at least 10 characters." });
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();

      if (json.success) {
        setStatus("success");
      } else if (json.errors) {
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(json.errors)) {
          flat[k] = Array.isArray(v) ? (v[0] as string) : String(v);
        }
        setErrors(flat);
        setStatus("idle");
      } else {
        setGeneral(json.message || "Something went wrong. Please try again.");
        setStatus("idle");
      }
    } catch {
      setGeneral("Network error. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-hairline bg-background/60 px-8 py-16 text-center"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
              <Check size={28} className="text-emerald-400" />
            </div>
            <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">
              Message sent
            </h2>
            <p className="mt-3 max-w-sm text-sm text-muted">
              Thanks, {form.name.split(" ")[0] || "friend"}. We&apos;ve got it
              and will reply to{" "}
              <span className="text-foreground">{form.email}</span> within 24
              hours.
            </p>
            <button
              data-cursor="hover"
              onClick={() => {
                setStatus("idle");
                setForm({
                  name: "",
                  email: "",
                  company: "",
                  projectType: "",
                  budget: "",
                  message: "",
                });
              }}
              className="mt-8 text-xs uppercase tracking-widest text-foreground/70 underline underline-offset-4 transition-colors hover:text-accent"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-5 rounded-2xl border border-hairline bg-background/60 p-7 lg:p-9"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-muted">
              Start a project
            </p>

            {general && (
              <div
                role="alert"
                className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                {general}
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" htmlFor="name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={cn(inputClasses, errors.name && "border-red-400/50")}
                />
              </Field>
              <Field label="Email" htmlFor="email" error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={cn(inputClasses, errors.email && "border-red-400/50")}
                />
              </Field>
            </div>

            <Field label="Company" htmlFor="company" error={errors.company}>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                value={form.company}
                onChange={(e) => set("company")(e.target.value)}
                placeholder="Company (optional)"
                aria-invalid={!!errors.company}
                aria-describedby={errors.company ? "company-error" : undefined}
                className={cn(inputClasses, errors.company && "border-red-400/50")}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Project type" htmlFor="projectType" error={errors.projectType}>
                <SelectField
                  id="projectType"
                  name="projectType"
                  value={form.projectType}
                  onChange={set("projectType")}
                  placeholder="Select a type"
                  options={PROJECT_TYPES}
                  error={errors.projectType}
                />
              </Field>
              <Field label="Budget" htmlFor="budget" error={errors.budget}>
                <SelectField
                  id="budget"
                  name="budget"
                  value={form.budget}
                  onChange={set("budget")}
                  placeholder="Select a range"
                  options={BUDGETS}
                  error={errors.budget}
                />
              </Field>
            </div>

            <Field label="Message" htmlFor="message" error={errors.message}>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => set("message")(e.target.value)}
                placeholder="Tell us about your project, timeline, and goals…"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                className={cn(inputClasses, "resize-none", errors.message && "border-red-400/50")}
              />
            </Field>

            <MagneticButton
              type="submit"
              variant="solid"
              size="lg"
              className="mt-2 w-full justify-center"
              disabled={status === "submitting"}
            >
              {status === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send message
                </>
              )}
            </MagneticButton>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
