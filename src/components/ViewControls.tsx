
import React from "react";
import { Button } from "./ui-components";
import { CameraView, CAMERA_VIEWS } from "@/lib/roomUtils";

interface ViewControlsProps {
  activeView: CameraView;
  onChange: (view: CameraView) => void;
}

const ViewControls: React.FC<ViewControlsProps> = ({ activeView, onChange }) => {
  return (
    <div className="space-y-2 slide-up" style={{ animationDelay: "100ms" }}>
      <h3 className="text-lg font-semibold mb-4">Camera View</h3>
      
      <div className="flex flex-wrap gap-2">
        {CAMERA_VIEWS.map((view) => (
          <Button
            key={view.id}
            variant={activeView === view.id ? "primary" : "outline"}
            size="sm"
            onClick={() => onChange(view.id)}
            className="flex-1 min-w-[120px]"
          >
            {view.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ViewControls;
