// src/components/auth/SignupDialog.tsx

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

import AppleIcon from "@/assets/apple.svg?react";
import GoogleIcon from "@/assets/google.svg?react";
import GithubIcon from "@/assets/github.svg?react";

import { Eye, EyeOff } from "lucide-react";

import { useState, useMemo } from "react";

export function SignupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ---------------------------------------------------------
  // Email validation
  // ---------------------------------------------------------
  const emailValid = useMemo(() => {
    if (!email) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  // ---------------------------------------------------------
  // Password strength meter (0–4)
  // ---------------------------------------------------------
  const passwordScore = useMemo(() => {
    if (!password) return 0;
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  }, [password]);

  const strengthLabel = ["Very weak", "Weak", "Medium", "Strong", "Excellent"][
    passwordScore
  ];

  const strengthColor = [
    "bg-red-600",
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-600",
    "bg-emerald-500",
  ][passwordScore];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-5000 bg-zinc-900 border border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle>Create your Flotix account</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Build visual data workflows, save nodes, and sync across devices.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className={`bg-zinc-800 text-white border ${emailValid === null
                  ? "border-zinc-700"
                  : emailValid
                    ? "border-green-600"
                    : "border-red-300"
                }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailValid === false && (
              <p className="text-red-300 text-xs">Enter a valid email address</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-zinc-800 text-white border-zinc-700 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-2 flex items-center text-zinc-400 hover:text-zinc-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>

            {/* Password Strength */}
            {password.length > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1 w-full bg-zinc-800 rounded">
                  <div
                    className={`h-full ${strengthColor} rounded transition-all`}
                    style={{ width: `${(passwordScore / 4) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-400">{strengthLabel}</span>
              </div>
            )}
          </div>

          {/* CREATE ACCOUNT */}
          <Button
            className="mt-2 bg-green-600 hover:bg-green-700"
            disabled={!emailValid || passwordScore < 2}
          >
            Create account
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-2">
            <div className="h-px flex-1 bg-zinc-700" />
            <span className="text-zinc-400 text-xs">or</span>
            <div className="h-px flex-1 bg-zinc-700" />
          </div>

          {/* OAuth */}
          <div className="flex flex-col gap-2 mt-2">
            <OAuthButton Icon={GoogleIcon} label="Sign up with Google" />
            <OAuthButton Icon={GithubIcon} label="Sign up with GitHub" />
            <OAuthButton Icon={AppleIcon} label="Sign up with Apple" />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Reusable */
function OAuthButton({
  Icon,
  label,
}: {
  Icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
}) {
  return (
    <Button
      variant="outline"
      className="w-full justify-center bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
    >
      <Icon className="mr-2 h-5 w-5" />
      {label}
    </Button>
  );
}
