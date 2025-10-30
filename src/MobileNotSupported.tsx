// components/MobileNotSupported.tsx

import { Smartphone, Monitor } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MobileNotSupported() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-muted">
      <Card className="max-w-sm text-center p-6 shadow-xl rounded-2xl">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Smartphone className="h-12 w-12 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold">
            Mobile Not Yet Supported
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            The Flotus editor is currently optimized for desktop browsers.
            Please open this link on a laptop or desktop computer.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm">
            <Monitor className="h-4 w-4" />
            <span>Best viewed on Chrome, Firefox, or Edge.</span>
          </div>

          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
