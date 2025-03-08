
import * as THREE from "three";
import { RoomDimensions } from "./roomUtils";

// Material definitions
export const createRoomMaterials = () => {
  return {
    wallMaterial: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.0,
      side: THREE.DoubleSide,
    }),
    
    floorMaterial: new THREE.MeshStandardMaterial({
      color: 0xe0e0e0, // Darker floor color
      roughness: 0.7,
      metalness: 0.1,
    }),
    
    ceilingMaterial: new THREE.MeshStandardMaterial({
      color: 0xf8f8f8,
      roughness: 0.9,
      metalness: 0.0,
    }),
    
    // Edge material for dark strokes
    edgeMaterial: new THREE.LineBasicMaterial({ 
      color: 0x403E43, // Dark charcoal color for edges
      linewidth: 1
    })
  };
};

// Helper function to create a surface with edges
export const createSurfaceWithEdges = (
  geometry: THREE.PlaneGeometry, 
  material: THREE.Material, 
  edgeMaterial: THREE.LineBasicMaterial,
  position: THREE.Vector3, 
  rotation: THREE.Euler,
  roomGroup: THREE.Group
) => {
  // Create the plane surface
  const plane = new THREE.Mesh(geometry, material);
  plane.position.copy(position);
  plane.rotation.copy(rotation);
  plane.receiveShadow = true;
  
  // Create edges
  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, edgeMaterial);
  line.position.copy(position);
  line.rotation.copy(rotation);
  
  // Add both to room
  roomGroup.add(plane);
  roomGroup.add(line);
};

// Create a complete room with all surfaces
export const createRoom = (dimensions: RoomDimensions, roomGroup: THREE.Group) => {
  // Clear previous room
  while (roomGroup.children.length) {
    roomGroup.remove(roomGroup.children[0]);
  }
  
  const { width, length, height } = dimensions;
  const materials = createRoomMaterials();
  
  // Create floor
  const floorGeometry = new THREE.PlaneGeometry(width, length);
  createSurfaceWithEdges(
    floorGeometry,
    materials.floorMaterial,
    materials.edgeMaterial,
    new THREE.Vector3(width/2, 0, length/2),
    new THREE.Euler(-Math.PI * 0.5, 0, 0),
    roomGroup
  );
  
  // Create ceiling
  const ceilingGeometry = new THREE.PlaneGeometry(width, length);
  createSurfaceWithEdges(
    ceilingGeometry,
    materials.ceilingMaterial,
    materials.edgeMaterial,
    new THREE.Vector3(width/2, height, length/2),
    new THREE.Euler(Math.PI * 0.5, 0, 0),
    roomGroup
  );
  
  // Create walls
  // Back wall
  const backWallGeometry = new THREE.PlaneGeometry(width, height);
  createSurfaceWithEdges(
    backWallGeometry,
    materials.wallMaterial,
    materials.edgeMaterial,
    new THREE.Vector3(width/2, height/2, 0),
    new THREE.Euler(0, 0, 0),
    roomGroup
  );
  
  // Front wall
  const frontWallGeometry = new THREE.PlaneGeometry(width, height);
  createSurfaceWithEdges(
    frontWallGeometry,
    materials.wallMaterial,
    materials.edgeMaterial,
    new THREE.Vector3(width/2, height/2, length),
    new THREE.Euler(0, Math.PI, 0),
    roomGroup
  );
  
  // Left wall
  const leftWallGeometry = new THREE.PlaneGeometry(length, height);
  createSurfaceWithEdges(
    leftWallGeometry,
    materials.wallMaterial,
    materials.edgeMaterial,
    new THREE.Vector3(0, height/2, length/2),
    new THREE.Euler(0, Math.PI * 0.5, 0),
    roomGroup
  );
  
  // Right wall
  const rightWallGeometry = new THREE.PlaneGeometry(length, height);
  createSurfaceWithEdges(
    rightWallGeometry,
    materials.wallMaterial,
    materials.edgeMaterial,
    new THREE.Vector3(width, height/2, length/2),
    new THREE.Euler(0, -Math.PI * 0.5, 0),
    roomGroup
  );
};
