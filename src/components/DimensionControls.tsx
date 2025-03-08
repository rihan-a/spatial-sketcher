
import React from "react";
import { Slider } from "./ui-components";
import { RoomDimensions, DEFAULT_ROOM } from "@/lib/roomUtils";

interface DimensionControlsProps {
  dimensions: RoomDimensions;
  onChange: (dimensions: RoomDimensions) => void;
}

const DimensionControls: React.FC<DimensionControlsProps> = ({ 
  dimensions, 
  onChange 
}) => {
  const handleChange = (key: keyof RoomDimensions) => (value: number) => {
    onChange({
      ...dimensions,
      [key]: value
    });
  };

  return (
    <div className="space-y-2 slide-up">
      <h3 className="text-lg font-semibold mb-4">Room Dimensions</h3>
      
      <Slider
        label="Width"
        min={1}
        max={10}
        value={dimensions.width}
        onChange={handleChange("width")}
      />
      
      <Slider
        label="Length"
        min={1}
        max={10}
        value={dimensions.length}
        onChange={handleChange("length")}
      />
      
      <Slider
        label="Height"
        min={2}
        max={6}
        value={dimensions.height}
        onChange={handleChange("height")}
      />

      <button
        onClick={() => onChange(DEFAULT_ROOM)}
        className="text-xs text-blue-500 hover:text-blue-700 mt-2 underline"
      >
        Reset to default
      </button>
    </div>
  );
};

export default DimensionControls;
