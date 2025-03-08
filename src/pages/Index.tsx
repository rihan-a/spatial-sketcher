import React, { useState } from "react";
import { Card } from "@/components/ui-components";
import DimensionControls from "@/components/DimensionControls";
import ViewControls from "@/components/ViewControls";
import RoomVisualizer from "@/components/RoomVisualizer";
import { RoomDimensions, CameraView, DEFAULT_ROOM } from "@/lib/roomUtils";

const Index = () => {
  const [dimensions, setDimensions] = useState<RoomDimensions>(DEFAULT_ROOM);
  const [cameraView, setCameraView] = useState<CameraView>("corner");
  
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 fade-in">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mb-2">
            3D Room Visualizer
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Design Your Perfect Space
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create a custom interior visualization by adjusting dimensions and selecting your preferred view angle.
          </p>
        </div>
        
        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Panel - Controls */}
          <div className="md:col-span-1 space-y-6">
            <Card className="scale-in">
              <DimensionControls 
                dimensions={dimensions} 
                onChange={setDimensions} 
              />
            </Card>
            
            <Card className="scale-in" style={{ animationDelay: "100ms" }}>
              <ViewControls 
                activeView={cameraView} 
                onChange={setCameraView}
                onDownload={() => {
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const link = document.createElement('a');
                    link.download = `room-${Date.now()}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  }
                }}
              />
            </Card>
            
            <Card className="scale-in" style={{ animationDelay: "200ms" }}>
              <div className="space-y-2 slide-up" style={{ animationDelay: "200ms" }}>
                <h3 className="text-lg font-semibold mb-3">Room Details</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-gray-500">Dimensions:</div>
                  <div className="font-medium">
                    {dimensions.width.toFixed(1)} × {dimensions.length.toFixed(1)} × {dimensions.height.toFixed(1)} m
                  </div>
                  
                  <div className="text-gray-500">Floor Area:</div>
                  <div className="font-medium">
                    {(dimensions.width * dimensions.length).toFixed(1)} m²
                  </div>
                  
                  <div className="text-gray-500">Volume:</div>
                  <div className="font-medium">
                    {(dimensions.width * dimensions.length * dimensions.height).toFixed(1)} m³
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Right Panel - 3D Visualization */}
          <div className="md:col-span-2 h-[500px] md:h-[600px] scale-in" style={{ animationDelay: "300ms" }}>
            <RoomVisualizer 
              dimensions={dimensions} 
              cameraView={cameraView} 
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm fade-in" style={{ animationDelay: "500ms" }}>
          <p>Visualize your space in 3D before making any design decisions.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
