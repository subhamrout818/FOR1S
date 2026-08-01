"use client";

import { useEffect, useState, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PRELOADED_AVATARS } from "@/lib/avatars";
import MagneticButton from "@/components/ui/MagneticButton";
import Avatar from "@/components/ui/Avatar";
import CameraCapture from "@/components/account/CameraCapture";
import {
  AlertCircle,
  ArrowLeft,
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Sparkles,
} from "lucide-react";

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

function SectionCard({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-hairline bg-background/60 p-7 lg:p-8">
      <h2 className="font-display text-xl font-semibold uppercase tracking-tightest text-foreground">
        {title}
      </h2>
      {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function StatusLine({
  message,
  error,
}: {
  message: string;
  error: string;
}) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          key="msg"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-1.5 text-sm text-emerald-400"
        >
          <Check size={14} /> {message}
        </motion.p>
      )}
      {error && (
        <motion.p
          key="err"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-1.5 text-sm text-red-400"
        >
          <AlertCircle size={14} /> {error}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

/** Center-crop an image file into a small square JPEG data URL. */
function fileToSquareDataUrl(file: File, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That doesn't look like a valid image"));
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas unavailable"));
        ctx.drawImage(
          img,
          (img.width - side) / 2,
          (img.height - side) / 2,
          side,
          side,
          0,
          0,
          size,
          size
        );
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export default function AccountPage() {
  const { user, token, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [nameBusy, setNameBusy] = useState(false);
  const [nameMsg, setNameMsg] = useState("");
  const [nameErr, setNameErr] = useState("");

  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoMsg, setPhotoMsg] = useState("");
  const [photoErr, setPhotoErr] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [emailPw, setEmailPw] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailMsg, setEmailMsg] = useState("");
  const [emailErr, setEmailErr] = useState("");

  const [pw, setPw] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwBusy, setPwBusy] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");

  /* Auth guard — key on the stored token like the other dashboards. */
  useEffect(() => {
    if (!isLoading && !token) router.push("/login");
  }, [isLoading, token, router]);

  /* Sync editable fields when the user loads. */
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (isLoading || !token) return null;

  const profileImage = user?.profileImage ?? null;

  const savePhoto = async (src: string) => {
    if (!token) return;
    setPhotoBusy(true);
    setPhotoMsg("");
    setPhotoErr("");
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ profileImage: src }),
      });
      const json = await res.json();
      if (json.success) {
        await refreshUser();
        setPhotoMsg("Profile photo updated");
      } else {
        setPhotoErr(json.message || json.errors?.profileImage?.[0] || "Could not update photo");
      }
    } catch {
      setPhotoErr("Network error. Please try again.");
    } finally {
      setPhotoBusy(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await fileToSquareDataUrl(file);
      await savePhoto(dataUrl);
    } catch (err) {
      setPhotoErr(err instanceof Error ? err.message : "Could not read the file");
    }
  };

  const handleName = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setNameBusy(true);
    setNameMsg("");
    setNameErr("");
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (json.success) {
        await refreshUser();
        setNameMsg("Name updated");
      } else {
        setNameErr(json.message || json.errors?.name?.[0] || "Could not update name");
      }
    } catch {
      setNameErr("Network error. Please try again.");
    } finally {
      setNameBusy(false);
    }
  };

  const handleEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setEmailBusy(true);
    setEmailMsg("");
    setEmailErr("");
    try {
      const res = await fetch("/api/account/email", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ email, currentPassword: emailPw }),
      });
      const json = await res.json();
      if (json.success) {
        await refreshUser();
        setEmailPw("");
        setEmailMsg("Email updated");
      } else {
        setEmailErr(json.message || "Could not update email");
      }
    } catch {
      setEmailErr("Network error. Please try again.");
    } finally {
      setEmailBusy(false);
    }
  };

  const handlePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setPwBusy(true);
    setPwMsg("");
    setPwErr("");
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pw, newPassword: pwNew }),
      });
      const json = await res.json();
      if (json.success) {
        setPw("");
        setPwNew("");
        setPwMsg("Password updated");
      } else {
        setPwErr(json.message || "Could not update password");
      }
    } catch {
      setPwErr("Network error. Please try again.");
    } finally {
      setPwBusy(false);
    }
  };

  return (
    <div className="relative mx-auto min-h-screen max-w-3xl px-6 pb-24 pt-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="font-mono text-xs tracking-wideish text-accent">
              SC.AC
            </span>
            <span className="h-px w-8 bg-hairline" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">
              Account
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
            Account settings
          </h1>
          <p className="mt-2 text-sm text-muted">
            Signed in as {user?.email ?? "you"}
          </p>
        </div>

        <MagneticButton
          variant="outline"
          size="md"
          cursorText="Go"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </MagneticButton>
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* Profile photo */}
        <SectionCard
          title="Profile photo"
          sub="Pick one of the pre-loaded styles, upload from your gallery, or take a photo."
        >
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <Avatar src={profileImage} size={96} className="border-2 border-hairline" />
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted">Current photo</p>
                <div className="flex flex-wrap gap-2">
                  <MagneticButton
                    variant="outline"
                    size="md"
                    cursorText="Go"
                    disabled={photoBusy}
                    onClick={() => fileRef.current?.click()}
                  >
                    <ImagePlus size={16} />
                    Upload
                  </MagneticButton>
                  <MagneticButton
                    variant="outline"
                    size="md"
                    cursorText="Go"
                    disabled={photoBusy}
                    onClick={() => setCameraOpen(true)}
                  >
                    <Camera size={16} />
                    Take photo
                  </MagneticButton>
                  {profileImage && (
                    <MagneticButton
                      variant="ghost"
                      size="md"
                      disabled={photoBusy}
                      onClick={() => savePhoto("")}
                    >
                      Reset to default
                    </MagneticButton>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                />
              </div>
            </div>

            <div>
              <p className="mb-3 flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted">
                <Sparkles size={13} className="text-accent" />
                Pre-loaded anime styles
              </p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {PRELOADED_AVATARS.map((path) => (
                  <button
                    key={path}
                    data-cursor="hover"
                    disabled={photoBusy}
                    onClick={() => savePhoto(path)}
                    className={cn(
                      "overflow-hidden rounded-xl border border-hairline transition-all duration-300",
                      "hover:border-accent/50 hover:shadow-[0_0_20px_rgba(230,57,70,0.2)]",
                      profileImage === path && "border-accent"
                    )}
                  >
                    <Avatar src={path} size={64} className="w-full rounded-none" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              {photoBusy ? (
                <p className="flex items-center gap-2 text-sm text-muted">
                  <Loader2 size={14} className="animate-spin" /> Saving…
                </p>
              ) : (
                <StatusLine message={photoMsg} error={photoErr} />
              )}
            </div>
          </div>
        </SectionCard>

        {/* Profile info */}
        <SectionCard title="Profile" sub="Your name as it appears around the site.">
          <form onSubmit={handleName} className="flex flex-col gap-4">
            <Field label="Name" htmlFor="name">
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
              />
            </Field>
            <div className="flex items-center justify-between gap-4">
              <StatusLine message={nameMsg} error={nameErr} />
              <MagneticButton
                type="submit"
                variant="solid"
                size="md"
                disabled={nameBusy}
              >
                {nameBusy ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Save name"
                )}
              </MagneticButton>
            </div>
          </form>
        </SectionCard>

        {/* Email */}
        <SectionCard title="Email" sub="Change the email you sign in with.">
          <form onSubmit={handleEmail} className="flex flex-col gap-4">
            <Field label="New email" htmlFor="email">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
              />
            </Field>
            <Field label="Current password" htmlFor="emailPw">
              <input
                id="emailPw"
                name="emailPw"
                type="password"
                required
                autoComplete="current-password"
                value={emailPw}
                onChange={(e) => setEmailPw(e.target.value)}
                placeholder="Confirm your password"
                className={inputClasses}
              />
            </Field>
            <div className="flex items-center justify-between gap-4">
              <StatusLine message={emailMsg} error={emailErr} />
              <MagneticButton
                type="submit"
                variant="solid"
                size="md"
                disabled={emailBusy}
              >
                {emailBusy ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Update email"
                )}
              </MagneticButton>
            </div>
          </form>
        </SectionCard>

        {/* Password */}
        <SectionCard title="Password" sub="Change your password. Use at least 8 characters.">
          <form onSubmit={handlePassword} className="flex flex-col gap-4">
            <Field label="Current password" htmlFor="pw">
              <input
                id="pw"
                name="pw"
                type="password"
                required
                autoComplete="current-password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className={inputClasses}
              />
            </Field>
            <Field label="New password" htmlFor="pwNew">
              <input
                id="pwNew"
                name="pwNew"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={pwNew}
                onChange={(e) => setPwNew(e.target.value)}
                placeholder="At least 8 characters"
                className={inputClasses}
              />
            </Field>
            <div className="flex items-center justify-between gap-4">
              <StatusLine message={pwMsg} error={pwErr} />
              <MagneticButton
                type="submit"
                variant="solid"
                size="md"
                disabled={pwBusy}
              >
                {pwBusy ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Update password"
                )}
              </MagneticButton>
            </div>
          </form>
        </SectionCard>
      </div>

      {/* Camera modal */}
      <AnimatePresence>
        {cameraOpen && (
          <CameraCapture
            onClose={() => setCameraOpen(false)}
            onCapture={(dataUrl) => {
              setCameraOpen(false);
              savePhoto(dataUrl);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
