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

// ---------------------------------------------------------------------------
// Login Dialog
// ---------------------------------------------------------------------------
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

        {/* ---------------------------------------------------------
            Email / password form
        --------------------------------------------------------- */}
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

          <Button className="mt-2 bg-blue-600 hover:bg-blue-700">Log in</Button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-2">
            <div className="h-px flex-1 bg-zinc-700" />
            <span className="text-zinc-400 text-xs">or</span>
            <div className="h-px flex-1 bg-zinc-700" />
          </div>

          {/* ---------------------------------------------------------
              OAuth buttons
          --------------------------------------------------------- */}
          <div className="flex flex-col gap-2 mt-2">

            {/* Google */}
            <Button
              variant="outline"
              className="w-full justify-center bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              <GoogleColorIcon className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>

            {/* GitHub */}
            <Button
              variant="outline"
              className="w-full justify-center bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              <GithubColorIcon className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>

            {/* Apple */}
            <Button
              variant="outline"
              className="w-full justify-center bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              <AppleColorIcon className="mr-2 h-5 w-5" />
              Continue with Apple
            </Button>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Google — Full official multicolor logo
// ============================================================================
function GoogleColorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path fill="#EA4335" d="M12 10.2v3.6h5.09c-.22 1.17-.9 2.72-2.19 3.81l3.52 2.73C20.07 17.87 21 15.13 21 12c0-.78-.07-1.53-.21-2.25H12z"/>
      <path fill="#34A853" d="M6.54 14.33A5.96 5.96 0 0 1 6.1 12c0-.81.15-1.6.43-2.33L3 6.64A9.003 9.003 0 0 0 3 17.36l3.54-3.03z"/>
      <path fill="#4285F4" d="M12 4.58c1.66 0 3.15.57 4.34 1.69l3.27-3.27A11.91 11.91 0 0 0 12 2C7.47 2 3.57 4.87 3 6.64l3.53 3.03C7.07 7.8 9.31 4.58 12 4.58z"/>
      <path fill="#FBBC05" d="M12 19.42c2.22 0 4.13-.73 5.52-1.98l-3.52-2.73c-.98.77-2.28 1.26-3.63 1.26-2.7 0-5-2.21-5.38-5.15L3 17.36A8.98 8.98 0 0 0 12 19.42z"/>
    </svg>
  );
}

// ============================================================================
// GitHub — Official black mark logo
// ============================================================================
function GithubColorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props} fill="black">
      <path d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.94c.58.11.79-.25.79-.56v-2.16c-3.2.7-3.88-1.39-3.88-1.39-.53-1.35-1.3-1.71-1.3-1.71-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.57-2.55-.29-5.23-1.28-5.23-5.73 0-1.27.45-2.31 1.2-3.13-.12-.3-.52-1.51.11-3.15 0 0 .98-.31 3.2 1.2a10.9 10.9 0 0 1 2.92-.39c.99 0 2 .13 2.93.39 2.22-1.51 3.2-1.2 3.2-1.2.63 1.64.23 2.85.12 3.15.75.82 1.19 1.86 1.19 3.13 0 4.47-2.69 5.43-5.25 5.72.42.37.8 1.1.8 2.23v3.3c0 .32.2.68.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

// ============================================================================
// Apple — Official gray logo
// ============================================================================
function AppleColorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props} fill="#A3AAAE">
      <path d="M16.75 1.5c0 1.2-.44 2.2-1.3 3a4.1 4.1 0 0 1-3.1 1.42c-.03-1.18.46-2.23 1.32-3.04C14.54 1.04 15.58.5 16.75.5c0 .33 0 .67 0 1zm3.03 16.65c-.63 1.37-1.4 2.63-2.31 3.78-1.07 1.36-2.26 1.4-3.43.53-.79-.6-1.52-.62-2.32-.03-1.56 1.13-2.63.82-3.72-.55a15.94 15.94 0 0 1-3.05-6.06c-.55-2.2-.4-4.27.9-6.2 1.02-1.54 2.39-2.36 4.14-2.4.8-.02 1.56.23 2.24.59.53.28.98.3 1.52-.02 1.5-.9 3.11-.83 4.64.1 1.45.88 2.34 2.2 2.74 3.87.42 1.73.16 3.38-.57 4.83z"/>
    </svg>
  );
}
