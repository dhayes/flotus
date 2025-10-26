// App.tsx

import "./App.css";
import Stage from "./Stage";
import Engine from "./Engine";
import Connections from "./Connections";
import NodeSidebar from "./NodeSidebar";
import { NodeEngineProvider } from "./NodeEngineContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useState } from "react";
import { useMobile } from "./hooks/use-mobile";

function App() {
  const isMobile = useMobile(); // or use a custom threshold
  const [offset, setOffset] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1,
  });

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black p-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Mobile not yet supported</h1>
          <p className="mt-2 text-sm opacity-70">
            Please open on a desktop or larger screen.
          </p>
        </div>
      </div>
    );
  }
  return (
    <NodeEngineProvider>
      <SidebarProvider>
        <DndProvider backend={HTML5Backend}>
          <div className="flex h-screen w-screen overflow-hidden">
            <NodeSidebar />
            <Stage setOffset={setOffset}>
              <Connections offset={offset}>
                <Engine />
              </Connections>
            </Stage>
          </div>
        </DndProvider>
      </SidebarProvider>
    </NodeEngineProvider>
  );
}

export default App;
