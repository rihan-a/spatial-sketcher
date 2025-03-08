
import { useEffect } from "react";
import * as THREE from "three";
import { CameraView, RoomDimensions, getCameraPosition, getCameraTarget } from "@/lib/roomUtils";

export function useCameraAnimation(
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>,
  dimensions: RoomDimensions, 
  cameraView: CameraView
) {
  // Update camera position based on selected view
  useEffect(() => {
    if (!cameraRef.current) return;
    
    const cameraPosition = getCameraPosition(dimensions, cameraView);
    const targetPosition = getCameraTarget(dimensions);
    
    // Animate camera position change
    const startPosition = new THREE.Vector3().copy(cameraRef.current.position);
    const targetVector = new THREE.Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    const startTime = Date.now();
    const duration = 1200; // 1.2 second animation
    
    const animateCameraMove = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease function - cubic ease out for smoother transitions
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      if (cameraRef.current) {
        cameraRef.current.position.lerpVectors(startPosition, targetVector, easeProgress);
        
        // Set camera lookAt for each frame of the animation
        const currentTarget = new THREE.Vector3(
          targetPosition.x, 
          targetPosition.y, 
          targetPosition.z
        );
        
        cameraRef.current.lookAt(currentTarget);
        
        if (progress < 1) {
          requestAnimationFrame(animateCameraMove);
        }
      }
    };
    
    animateCameraMove();
    
    // Add a small console log to help with debugging camera positions
    console.log(`Camera moved to ${cameraView} view:`, cameraPosition);
    
  }, [dimensions, cameraView, cameraRef]);
}
