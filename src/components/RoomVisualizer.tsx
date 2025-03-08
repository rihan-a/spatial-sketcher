
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { RoomDimensions, CameraView, getCameraPosition, getCameraTarget } from "@/lib/roomUtils";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const roomRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);
  
  // Setup three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f7);
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional lights from different angles
    const createDirectionalLight = (x: number, y: number, z: number, intensity: number) => {
      const light = new THREE.DirectionalLight(0xffffff, intensity);
      light.position.set(x, y, z);
      light.castShadow = true;
      light.shadow.camera.near = 0.5;
      light.shadow.camera.far = 50;
      light.shadow.camera.right = 15;
      light.shadow.camera.left = -15;
      light.shadow.camera.top = 15;
      light.shadow.camera.bottom = -15;
      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;
      return light;
    };

    scene.add(createDirectionalLight(5, 10, 5, 0.8));
    scene.add(createDirectionalLight(-5, 8, -10, 0.3));
    
    // Create room group to hold walls, floor, ceiling
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);
    roomRef.current = roomGroup;
    
    // Create grid helper for reference
    const gridHelper = new THREE.GridHelper(10, 10, 0xaaaaaa, 0xdddddd);
    scene.add(gridHelper);
    
    // Animation loop
    const animate = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
      
      rendererRef.current.render(sceneRef.current, cameraRef.current);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    
    frameIdRef.current = requestAnimationFrame(animate);
    
    // Handle window resizing
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  // Update room dimensions
  useEffect(() => {
    if (!roomRef.current) return;
    
    // Clear previous room
    while (roomRef.current.children.length) {
      roomRef.current.remove(roomRef.current.children[0]);
    }
    
    const { width, length, height } = dimensions;
    
    // Material definitions
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xf0f0f0,
      roughness: 0.5,
      metalness: 0.0,
    });
    
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8f8f8,
      roughness: 0.9,
      metalness: 0.0,
    });
    
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(width, length);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI * 0.5;
    floor.position.set(width/2, 0, length/2);
    floor.receiveShadow = true;
    roomRef.current.add(floor);
    
    // Create ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(width, length);
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI * 0.5;
    ceiling.position.set(width/2, height, length/2);
    ceiling.receiveShadow = true;
    roomRef.current.add(ceiling);
    
    // Create walls
    // Back wall
    const backWallGeometry = new THREE.PlaneGeometry(width, height);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(width/2, height/2, 0);
    backWall.receiveShadow = true;
    roomRef.current.add(backWall);
    
    // Front wall
    const frontWallGeometry = new THREE.PlaneGeometry(width, height);
    const frontWall = new THREE.Mesh(frontWallGeometry, wallMaterial);
    frontWall.position.set(width/2, height/2, length);
    frontWall.rotation.y = Math.PI;
    frontWall.receiveShadow = true;
    roomRef.current.add(frontWall);
    
    // Left wall
    const leftWallGeometry = new THREE.PlaneGeometry(length, height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(0, height/2, length/2);
    leftWall.rotation.y = Math.PI * 0.5;
    leftWall.receiveShadow = true;
    roomRef.current.add(leftWall);
    
    // Right wall
    const rightWallGeometry = new THREE.PlaneGeometry(length, height);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(width, height/2, length/2);
    rightWall.rotation.y = -Math.PI * 0.5;
    rightWall.receiveShadow = true;
    roomRef.current.add(rightWall);
    
  }, [dimensions]);
  
  // Update camera position based on selected view
  useEffect(() => {
    if (!cameraRef.current) return;
    
    const cameraPosition = getCameraPosition(dimensions, cameraView);
    const targetPosition = getCameraTarget(dimensions);
    
    // Animate camera position change
    const startPosition = new THREE.Vector3().copy(cameraRef.current.position);
    const targetVector = new THREE.Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    const startTime = Date.now();
    const duration = 1200; // 1.2 second animation - slightly longer for smoother transitions
    
    const animateCameraMove = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease function - cubic ease out for smoother transitions
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      if (cameraRef.current) {
        cameraRef.current.position.lerpVectors(startPosition, targetVector, easeProgress);
        
        // Set camera lookAt for each frame of the animation
        // This ensures the camera smoothly changes its orientation during movement
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
    
  }, [dimensions, cameraView]);
  
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
