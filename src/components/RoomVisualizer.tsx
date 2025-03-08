
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { RoomDimensions, CameraView } from "@/lib/roomUtils";
import { useThreeScene } from "@/hooks/useThreeScene";
import { useCameraAnimation } from "@/hooks/useCameraAnimation";
import { createRoom } from "@/lib/roomRenderUtils";

interface RoomVisualizerProps {
  dimensions: RoomDimensions;
  cameraView: CameraView;
  className?: string;
}

const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ 
  dimensions, 
  cameraView,
  className 
}) => {
  const { containerRef, sceneRef, cameraRef } = useThreeScene();
  const roomRef = useRef<THREE.Group | null>(null);
  
  // Setup room group
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // Create room group to hold walls, floor, ceiling
    const roomGroup = new THREE.Group();
    sceneRef.current.add(roomGroup);
    roomRef.current = roomGroup;
    
    return () => {
      if (roomRef.current && sceneRef.current) {
        sceneRef.current.remove(roomRef.current);
      }
    };
  }, [sceneRef]);
  
  // Update room dimensions
  useEffect(() => {
    if (!roomRef.current) return;
    createRoom(dimensions, roomRef.current);
  }, [dimensions]);
  
  // Handle camera animations
  useCameraAnimation(cameraRef, dimensions, cameraView);
  
  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full rounded-xl overflow-hidden shadow-lg ${className}`}
      style={{ 
        background: "linear-gradient(145deg, rgba(245,245,247,1) 0%, rgba(230,230,235,1) 100%)", 
        transition: "all 0.3s ease" 
      }}
    />
  );
};

export default RoomVisualizer;
