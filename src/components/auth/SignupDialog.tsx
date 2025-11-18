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

export function SignupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle>Create your Flotix account</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Build visual data workflows, save nodes, and sync across devices.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
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

          <Button className="mt-2 bg-green-600 hover:bg-green-700">
            Create account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
