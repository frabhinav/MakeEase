// BackgroundRenderer.jsx
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const BackgroundRenderer = () => {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const mainScene = useThree((state) => state.scene);

  const renderTarget = useRef(
    new THREE.WebGLRenderTarget(size.width, size.height)
  );
  const bgScene = useRef(new THREE.Scene());
  // bgScene.current.background = new THREE.Color("white");
  const bgCamera = useRef(
    new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100)
  );
  const headRef = useRef();
  const targetRotation = useRef(new THREE.Vector2(0, 0));
  const currentRotation = useRef(new THREE.Vector2(0, 0));
  const lastInteraction = useRef(Date.now());
  const isHovering = useRef(false);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const { scene } = useGLTF("/head.glb");

  // Set up model
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.material.map) {
          child.material.map = null;
          child.material.needsUpdate = true;
        }

        child.material.color = new THREE.Color("red");
        // child.material.color.set("red");
        child.material.roughness = 0.5;
        child.material.metalness = 0.2;
      }
    });

    scene.scale.set(0.9, 0.9, 0.9);
    scene.position.set(0, 0, 2);
    headRef.current = scene;
    bgScene.current.add(scene);
  }, [scene]);

  // Handle cursor move + leave
  useEffect(() => {
    const handlePointerMove = (e) => {
      // Convert mouse to normalized device coordinates (-1 to +1)
      mouse.x = (e.clientX / size.width) * 2 - 1;
      mouse.y = -(e.clientY / size.height) * 2 + 1;

      raycaster.setFromCamera(mouse, bgCamera.current);

      const intersects = raycaster.intersectObject(headRef.current, true); // true for recursive

      if (intersects.length > 0) {
        isHovering.current = true;

        // Only update target rotation if hovering
        const x = e.clientX / size.width - 0.5;
        const y = e.clientY / size.height - 0.5;
        targetRotation.current.set(x * Math.PI, -y * Math.PI * 0.5);

        lastInteraction.current = Date.now(); // refresh idle timer
      } else {
        isHovering.current = false;
      }
    };

    const handlePointerLeave = () => {
      isHovering.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [size]);
  // Animate & render
  useFrame(() => {
    if (!headRef.current || !bgCamera.current) return;

    const elapsed = Date.now() - lastInteraction.current;
    const isIdle = elapsed > 1500; // 1.5 seconds of no interaction

    bgCamera.current.position.set(0, 0, 5);
    bgCamera.current.lookAt(0, 0, 0);

    if (isIdle) {
      currentRotation.current.x += 0.005;
      currentRotation.current.y += 0;
    } else {
      // Smoothly lerp toward target from cursor
      currentRotation.current.x = THREE.MathUtils.lerp(
        currentRotation.current.x,
        targetRotation.current.x,
        0.1
      );
      currentRotation.current.y = THREE.MathUtils.lerp(
        currentRotation.current.y,
        targetRotation.current.y,
        0.1
      );
    }

    headRef.current.rotation.y = currentRotation.current.x;
    headRef.current.rotation.x = currentRotation.current.y;

    // Rotate head based on hover/cursor
    if (isHovering.current) {
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
      headRef.current.rotation.y += 0.01; // auto rotate
    }

    // Render to offscreen target
    gl.setRenderTarget(renderTarget.current);
    gl.render(bgScene.current, bgCamera.current);
    gl.setRenderTarget(null);

    // Set it as the background
    mainScene.background = renderTarget.current.texture;
  });

  return null;
};

export default BackgroundRenderer;
