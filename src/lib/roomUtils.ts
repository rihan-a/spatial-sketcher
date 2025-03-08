
// Camera view presets
export type CameraView = 'corner' | 'side' | 'top' | 'front';

export interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

export const DEFAULT_ROOM: RoomDimensions = {
  width: 4,
  length: 5,
  height: 3
};

// Camera position presets based on room dimensions
export const getCameraPosition = (dimensions: RoomDimensions, view: CameraView): CameraPosition => {
  const { width, length, height } = dimensions;
  const maxDimension = Math.max(width, length, height);
  
  switch (view) {
    case 'corner':
      return {
        x: width * 0.8,  // Moved further out from the corner
        y: height * 0.7, // Slightly higher perspective
        z: length * 0.8, // Moved further out from the corner
      };
    case 'side':
      return {
        x: width * 1.5,  // Positioned further away from the side wall
        y: height * 0.6, // Slightly higher for better perspective
        z: length * 0.3, // Positioned slightly off-center
      };
    case 'top':
      return {
        x: width * 0.3,  // Slightly off-center for a better top view
        y: height * 2.2, // Higher for a more direct top-down view
        z: length * 0.3, // Slightly off-center
      };
    case 'front':
      return {
        x: width * 0.3,  // Positioned off-center for a more natural view
        y: height * 0.6, // Positioned higher for a better perspective
        z: length * 1.5, // Positioned further away from the front wall
      };
    default:
      return {
        x: width * 0.7,
        y: height * 0.6,
        z: length * 0.7,
      };
  }
};

// Calculate target position for camera to look at
export const getCameraTarget = (dimensions: RoomDimensions): CameraPosition => {
  // Adjust where the camera looks at - slightly off-center for more natural views
  return {
    x: dimensions.width * 0.45,  // Slightly off-center horizontally
    y: dimensions.height * 0.4,  // Look at a lower point in the room
    z: dimensions.length * 0.45, // Slightly off-center depth-wise
  };
};

// Format dimension values for display
export const formatDimension = (value: number): string => {
  return `${value.toFixed(1)} m`;
};

// Camera view options with display names
export const CAMERA_VIEWS: { id: CameraView; label: string }[] = [
  { id: 'corner', label: 'Corner View' },
  { id: 'side', label: 'Side View' },
  { id: 'top', label: 'Top View' },
  { id: 'front', label: 'Front View' },
];
