import { Canvas, events, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import * as THREE from "three";
// import "./styles.css"; // For styling

// Load the 3D Human Head Model
const HumanHead = ({ onHoverStart, onHoverEnd }) => {
  const { scene } = useGLTF("/head.glb"); // Load your 3D head model
  const headRef = useRef();
  // const [isDragging, setIsDragging] = useState(new THREE.Vector2(0, 0));
  const targetRotation = useRef(new THREE.Vector2(0, 0));
  const isHovering = useRef(false);
  const starX = useRef(0);

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color: "white",
        roughness: 10,
        metalness: 0.5,
        // emissive: new THREE.Color(0xeeeeee),
      });
    }
  });

  // Rotate the head continuously
  useFrame(() => {
    if (headRef.current) {
      if (isHovering.current) {
        // Smoothly rotate towards the target rotation (cursor movement)
        headRef.current.rotation.y = THREE.MathUtils.lerp(
          headRef.current.rotation.y,
          targetRotation.current.x,
          0.1
        );
        headRef.current.rotation.x = THREE.MathUtils.lerp(
          headRef.current.rotation.x,
          targetRotation.current.y,
          0.1
        );
      } else {
        // Resume slow auto-rotation when not hovering
        headRef.current.rotation.y += 0.01;
      }
    }
  });

  const handlePointerDown = (event) => {
    // setIsDragging(true);
    starX.current = event.clientX;
  };

  const handlePointerMove = (event) => {
    isHovering.current = true;
    onHoverStart?.();
    const { clientX, clientY, target } = event;
    const { width, height, left, top } = target.getBoundingClientRect();

    const x = (clientX - left) / width - 0.5; // Normalize -0.5 to 0.5
    const y = (clientY - top) / height - 0.5;

    targetRotation.current.set(x * Math.PI, -y * Math.PI * 0.5);
  };

  const handlePointerLeave = () => {
    isHovering.current = false;
    onHoverEnd?.();
  };

  // const handlePointerUp = () => {
  //   setIsDragging(false);
  // };

  return (
    <primitive
      ref={headRef}
      object={scene}
      scale={2.2}
      position={[0, 0, 0]}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      // onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
    />
  );
};

const Scene = ({ onHoverStart, onHoverEnd }) => {
  return (
    <div className="scene-container">
      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={2} />
        <directionalLight position={[2, 2, 2]} intensity={5} />
        <HumanHead onHoverStart={onHoverStart} onHoverEnd={onHoverEnd} />
      </Canvas>
    </div>
  );
};

export default Scene;
