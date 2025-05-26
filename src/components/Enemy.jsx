import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Enemy({ position }) {
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.position.y -= 0.01;
    }
  });

  return (
    <mesh ref={ref} position={[position.x, position.y, position.z]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}
