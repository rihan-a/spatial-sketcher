
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
        x: width * 0.7,
        y: height * 0.6,
        z: length * 0.7,
      };
    case 'side':
      return {
        x: width * 1.2,
        y: height * 0.5,
        z: 0,
      };
    case 'top':
      return {
        x: 0,
        y: height * 2,
        z: 0,
      };
    case 'front':
      return {
        x: 0,
        y: height * 0.5,
        z: length * 1.2,
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
  return {
    x: dimensions.width / 2,
    y: dimensions.height / 2,
    z: dimensions.length / 2,
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
