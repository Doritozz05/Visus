"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment, ContactShadows, Text } from "@react-three/drei";
import * as THREE from "three";

function Book() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    // Smooth tilt based on mouse position + initial offset for better visibility (Opposite direction, steeper)
    const targetRotationX = (state.mouse.y * Math.PI) / 10;
    const targetRotationY = ((state.mouse.x * Math.PI) / 6) - (Math.PI / 4);
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} rotation={[0, -Math.PI / 4, 0]}>
        {/* Main Book Body */}
        <group>
          {/* Front Cover */}
          <mesh position={[0, 0, 0.11]}>
            <boxGeometry args={[3, 4, 0.06]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.2} />
          </mesh>

          {/* Spine */}
          <mesh position={[-1.5, 0, 0]}>
            <boxGeometry args={[0.08, 4, 0.28]} />
            <meshStandardMaterial color="#111111" roughness={0.4} metalness={0.2} />
          </mesh>

          {/* Pages */}
          <mesh position={[0.02, 0, 0]}>
            <boxGeometry args={[2.95, 3.9, 0.22]} />
            <meshStandardMaterial color="#f0f0f0" roughness={1} />
          </mesh>

          {/* Back Cover */}
          <mesh position={[0, 0, -0.11]}>
            <boxGeometry args={[3, 4, 0.06]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.2} />
          </mesh>
        </group>

        {/* Cover Decorations (Silver-Leaf Effect) */}
        <group position={[0, 0, 0.16]}> {/* Base offset for decorations */}
          {/* Border Frame */}
          <mesh position={[0, 0, 0]}>
            <ringGeometry args={[1.3, 1.32, 4, 1, Math.PI / 4]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={1} 
              roughness={0.1} 
              emissive="#e2e8f0" 
              emissiveIntensity={0.2}
              polygonOffset
              polygonOffsetFactor={-4}
            />
          </mesh>
          
          {/* Vertical Detail Line - Increased Z-offset specifically for this line */}
          <mesh position={[-1.2, 0, 0.01]}>
            <planeGeometry args={[0.02, 3.5]} />
            <meshStandardMaterial 
              color="#ffffff" 
              metalness={1} 
              roughness={0.1}
              polygonOffset
              polygonOffsetFactor={-4}
            />
          </mesh>

          <Suspense fallback={null}>
            {/* Main Title - Centered within the frame (y=0 is frame center) */}
            <Text
              position={[0, 0.1, 0.02]} 
              fontSize={0.25}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              maxWidth={2.2}
              textAlign="center"
              letterSpacing={0.05}
            >
              THE ART OF READING
            </Text>
            
            {/* Subtitle - Slightly below title, still within frame */}
            <Text
              position={[0, -0.3, 0.02]}
              fontSize={0.07}
              color="#94a3b8"
              anchorX="center"
              anchorY="middle"
              maxWidth={2}
              textAlign="center"
              letterSpacing={0.2}
            >
              A VISUS DIGITAL ARCHIVE
            </Text>

            {/* Edition Mark - Kept at bottom */}
            <Text
              position={[0, -1.2, 0.02]}
              fontSize={0.06}
              color="#64748b"
              anchorX="center"
              anchorY="middle"
              opacity={0.6}
            >
              MCMXXVI / v0.2.0
            </Text>
          </Suspense>
        </group>
      </group>
    </Float>
  );
}


export const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%' }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
        <ambientLight intensity={1.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={1} />
        
        <Suspense fallback={null}>
          <Book />
          <Environment preset="city" />
          <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
        </Suspense>
      </Canvas>
    </div>
  );
};
