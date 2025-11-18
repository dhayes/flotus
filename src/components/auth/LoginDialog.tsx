// src/components/auth/LoginDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

          <Button className="mt-2 bg-blue-600 hover:bg-blue-700">
            Log in
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
