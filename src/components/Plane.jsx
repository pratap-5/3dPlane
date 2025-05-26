// import React, { useRef, useEffect, forwardRef } from 'react';
// import { useGLTF } from '@react-three/drei';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// const Plane = forwardRef(({ onFire }, ref) => {
//   const group = useRef();
//   const propellerRef = useRef();
//   const keys = useRef({});

//   const speed = 0.3;
//   const rotationSpeed = 0.03;
//   const verticalSpeed = 0.1;
//   const { scene } = useGLTF('/models/plane.glb');

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       keys.current[e.key.toLowerCase()] = true;  // lowercase for consistency

//       if (e.code === 'Space') {
//         const dir = new THREE.Vector3();
//         group.current.getWorldDirection(dir);

//         // Optionally adjust direction to fire slightly offset (example: rotate dir a bit)
//         // For now, we keep it as is for nose direction

//         const firePosition = propellerRef.current
//           ? propellerRef.current.getWorldPosition(new THREE.Vector3())
//           : group.current.getWorldPosition(new THREE.Vector3());

//         onFire(firePosition, dir);
//       }
//     };

//     const handleKeyUp = (e) => {
//       keys.current[e.key.toLowerCase()] = false;
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//     };
//   }, [onFire]);

//   useEffect(() => {
//     if (group.current) {
//       const propeller = group.current.getObjectByName('Propeller_Cone');
//       if (propeller) {
//         propellerRef.current = propeller;
//       }
//     }
//   }, [scene]);

//   useFrame((state) => {
//     if (!group.current) return;

//     // Get plane's forward direction
//     const forward = new THREE.Vector3();
//     group.current.getWorldDirection(forward);

//     // Left/right rotation
//     if (keys.current['arrowleft']) group.current.rotation.y += rotationSpeed;
//     if (keys.current['arrowright']) group.current.rotation.y -= rotationSpeed;

//     // Forward/backward movement
//     if (keys.current['arrowup']) {
//       group.current.position.add(forward.clone().multiplyScalar(-speed));
//     }
//     if (keys.current['arrowdown']) {
//       group.current.position.add(forward.clone().multiplyScalar(speed));
//     }

//     // Up/down movement on S and X keys
//     if (keys.current['s']) {
//       group.current.position.y += verticalSpeed;  // Move up
//     }
//     if (keys.current['x']) {
//       group.current.position.y -= verticalSpeed;  // Move down
//     }

//     // Rotate propeller
//     if (propellerRef.current) {
//       propellerRef.current.rotation.z += 1;
//     }

//     // Smooth camera follow
//     const camera = state.camera;
//     camera.position.lerp(group.current.position.clone().add(new THREE.Vector3(0, 3, 10)), 0.1);
//     camera.lookAt(group.current.position);
//   });

//   return (
//     <primitive
//       ref={(node) => {
//         group.current = node;
//         if (ref) ref.current = node;
//       }}
//       object={scene}
//       scale={0.5}
//     />
//   );
// });

// export default Plane;
import React, { useRef, useEffect, forwardRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const Plane = forwardRef(({ onFire, controls = {} }, ref) => {
  const group = useRef();
  const propellerRef = useRef();
  const keys = useRef({});
  const { scene } = useGLTF("/models/plane.glb");

  const SPEED = 0.3;
  const ROTATION_SPEED = 0.03;
  const VERTICAL_SPEED = 0.1;

  const fireBullet = () => {
    if (!group.current) return;

    const dir = new THREE.Vector3();
    group.current.getWorldDirection(dir);

    const firePosition = propellerRef.current
      ? propellerRef.current.getWorldPosition(new THREE.Vector3())
      : group.current.getWorldPosition(new THREE.Vector3());

    onFire(firePosition, dir);
  };

  // Normalize control input (keyboard + props)
  const isControlActive = (key) => {
    return keys.current[key.toLowerCase()] || controls[key.toLowerCase()];
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") keys.current["fire"] = true;
      else keys.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") keys.current["fire"] = false;
      else keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (group.current) {
      const propeller = group.current.getObjectByName("Propeller_Cone");
      if (propeller) {
        propellerRef.current = propeller;
      }
    }
  }, [scene]);

  useFrame((state) => {
    const plane = group.current;
    if (!plane) return;

    const forward = new THREE.Vector3();
    plane.getWorldDirection(forward);

    if (isControlActive("arrowleft")) plane.rotation.y += ROTATION_SPEED;
    if (isControlActive("arrowright")) plane.rotation.y -= ROTATION_SPEED;
    if (isControlActive("arrowup"))
      plane.position.addScaledVector(forward, -SPEED);
    if (isControlActive("arrowdown"))
      plane.position.addScaledVector(forward, SPEED);
    if (isControlActive("s")) plane.position.y += VERTICAL_SPEED;
    if (isControlActive("x")) plane.position.y -= VERTICAL_SPEED;
    if (isControlActive("fire")) fireBullet();

    if (propellerRef.current) {
      propellerRef.current.rotation.z += 1;
    }

    // Smooth camera follow
    const cameraOffset = new THREE.Vector3(0, 3, 10);
    const targetPosition = plane.position.clone().add(cameraOffset);
    state.camera.position.lerp(targetPosition, 0.1);
    state.camera.lookAt(plane.position);
  });

  return (
    <primitive
      ref={(node) => {
        group.current = node;
        if (ref) ref.current = node;
      }}
      object={scene}
      scale={0.5}
    />
  );
});

export default Plane;
