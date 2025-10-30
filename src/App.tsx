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
import { useIsMobile } from "./hooks/useIsMobile";
import MobileNotSupported from "./MobileNotSupported";

function App() {
  const isMobile = useIsMobile(); // or use a custom threshold
  const [offset, setOffset] = useState<{ x: number; y: number; scale: number }>({
    x: 0,
    y: 0,
    scale: 1,
  });

  if (isMobile) {
    return (
      <MobileNotSupported />
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
