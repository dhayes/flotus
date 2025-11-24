// src/components/auth/ResetPasswordDialog.tsx

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useState, useMemo } from "react";

export function ResetPasswordDialog({
  open,
  onOpenChange,
  onBackToLogin,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBackToLogin?: () => void; // optional callback
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  // ---------------------------------------------------------
  // Email validation
  // ---------------------------------------------------------
  const emailValid = useMemo(() => {
    if (!email) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const sendReset = () => {
    if (!emailValid) return;
    // TODO: Call your Rust backend endpoint here
    setSent(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-5000 bg-zinc-900 border border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription className="text-zinc-400">
            We’ll send a password reset link to your email.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">

          {/* EMAIL FIELD */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              className={`bg-zinc-800 text-white border ${
                emailValid === null
                  ? "border-zinc-700"
                  : emailValid
                  ? "border-green-600"
                  : "border-red-600"
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSent(false);
              }}
            />

            {emailValid === false && (
              <p className="text-red-500 text-xs">Enter a valid email address</p>
            )}

            {sent && (
              <p className="text-green-500 text-xs mt-1">
                Reset link sent. Check your inbox.
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            className="mt-1 bg-blue-600 hover:bg-blue-700"
            disabled={!emailValid}
            onClick={sendReset}
          >
            Send reset link
          </Button>

          {/* BACK TO LOGIN */}
          {onBackToLogin && (
            <button
              type="button"
              className="text-xs text-zinc-400 hover:text-zinc-200 underline-offset-2 hover:underline mt-2 self-end"
              onClick={onBackToLogin}
            >
              Back to log in
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
