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

import { Github, Apple } from "lucide-react";

export function LoginDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
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


        {/* --------------------------------------------- 
            Email/password form
        --------------------------------------------- */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="bg-zinc-800 text-white border-zinc-700"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              className="bg-zinc-800 text-white border-zinc-700"
              placeholder="••••••••"
            />
          </div>

          <Button className="mt-2 bg-blue-600 hover:bg-blue-700">
            Log in
          </Button>
        {/* Divider */}
        <div className="flex items-center gap-2 my-2">
          <div className="h-px flex-1 bg-zinc-700" />
          <span className="text-zinc-400 text-xs">or</span>
          <div className="h-px flex-1 bg-zinc-700" />
        </div>

        {/* --------------------------------------------- 
            OAuth login 
        --------------------------------------------- */}
        <div className="flex flex-col gap-2 mt-2">
          {/* Google */}
          <Button
            variant="outline"
            className="w-full justify-center bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
          >
            <GoogleIcon className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          {/* GitHub */}
          <Button
            variant="outline"
            className="w-full justify-center bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
          >
            <Github className="mr-2 h-5 w-5" />
            Continue with GitHub
          </Button>

          {/* Apple */}
          <Button
            variant="outline"
            className="w-full justify-center bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
          >
            <Apple className="mr-2 h-5 w-5" />
            Continue with Apple
          </Button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------
   Google Icon (SVG)
   Lucide does not provide one, so include inline.
------------------------------------------------------- */
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props} fill="currentColor">
      <path
        d="M21.35 11.1H12v2.9h5.35c-.25 1.4-1.55 4.1-5.35 4.1-3.25 0-5.9-2.7-5.9-6s2.65-6 5.9-6c1.85 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2 12 2 6.95 2 3 5.9 3 11s3.95 9 9 9c5.2 0 8.65-3.65 8.65-8.8 0-.6-.05-1.1-.3-1.6Z"
      />
    </svg>
  );
}
