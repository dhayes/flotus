// src/components/auth/LoginDialog.tsx

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

export function LoginDialog({
  open,
  onOpenChange,
  onForgotPassword,
  onSignup,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onForgotPassword: () => void;
  onSignup: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-5000 bg-zinc-900 border border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle>Log in to Flotix</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Access your projects, preferences, and saved workflows.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-zinc-800 text-white border-zinc-700"
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-zinc-800 text-white border-zinc-700"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end -mt-1">
            <button
              type="button"
              className="text-xs text-zinc-400 hover:text-zinc-300 underline-offset-2 hover:underline"
              onClick={onForgotPassword}
            >
              Forgot password?
            </button>
          </div>

          {/* Login */}
          <Button className="mt-0 bg-blue-600 hover:bg-blue-700">
            Log in
          </Button>

          {/* Signup via email */}
          <button
            type="button"
            className="text-xs text-zinc-400 hover:text-zinc-300 mt-1 underline-offset-2 hover:underline"
            onClick={onSignup}
          >
            Don’t have an account? Sign up with email
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-2">
            <div className="h-px flex-1 bg-zinc-700" />
            <span className="text-zinc-400 text-xs">or</span>
            <div className="h-px flex-1 bg-zinc-700" />
          </div>

          {/* OAuth */}
          <div className="flex flex-col gap-2 mt-2">
            <OAuthButton Icon={GoogleIcon} label="Continue with Google" />
            <OAuthButton Icon={GithubIcon} label="Continue with GitHub" />
            <OAuthButton Icon={AppleIcon} label="Continue with Apple" />
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Shared OAuth button */
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
