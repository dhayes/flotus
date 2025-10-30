// components/MobileNotSupported.tsx
import { Smartphone, Monitor } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function MobileNotSupported() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0a0a0a] text-gray-200">
      <Card className="max-w-sm w-[90%] bg-[#161616] border border-gray-800 text-center shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col items-center space-y-4">
          <Smartphone className="h-12 w-12 text-gray-400" />
          <CardTitle className="text-xl font-semibold text-gray-100">
            Mobile Not Supported
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-gray-400">
          <p>
            The Flotus editor is designed for desktop browsers.
            Please open this project on a laptop or desktop computer.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Monitor className="h-4 w-4" />
            <span>Best viewed on Chrome, Firefox, or Edge.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
