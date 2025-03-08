import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export interface ThreeSceneRefs {
  containerRef: React.RefObject<HTMLDivElement>;
  rendererRef: React.RefObject<THREE.WebGLRenderer | null>;
  sceneRef: React.RefObject<THREE.Scene | null>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  frameIdRef: React.RefObject<number | null>;
  controlsRef: React.RefObject<OrbitControls | null>;
}

export function useThreeScene(dimensions: { width: number; length: number; height: number }): ThreeSceneRefs {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // Setup three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f7);
    sceneRef.current = scene;
    
    // Create camera with wider field of view
    const camera = new THREE.PerspectiveCamera(
      65, // Wider angle
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional lights from different angles
    scene.add(createDirectionalLight(5, 10, 5, 0.8));
    scene.add(createDirectionalLight(-5, 8, -10, 0.3));
    
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
    
    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false; // Start disabled
    controls.minDistance = 1;
    controls.maxDistance = Math.max(dimensions.width, dimensions.length, dimensions.height) * 0.8;
    controlsRef.current = controls;
    
    // Add camera position constraints
    controls.addEventListener('change', () => {
      if (controlsRef.current?.enabled) {
        // Keep camera at fixed height
        camera.position.y = 1.7;
        
        // Calculate room boundaries
        const padding = 0.5;
        const minX = padding;
        const maxX = dimensions.width - padding;
        const minZ = padding;
        const maxZ = dimensions.length - padding;
        
        // Clamp camera position
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, minX, maxX);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, minZ, maxZ);
      }
    });
    
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      window.removeEventListener("resize", handleResize);
    };
  }, [dimensions]);

  return {
    containerRef,
    rendererRef,
    sceneRef,
    cameraRef,
    frameIdRef,
    controlsRef
  };
}

// Helper function to create directional light
function createDirectionalLight(x: number, y: number, z: number, intensity: number) {
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
}
