import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function BulletManager({ bullets }) {
  const refs = useRef([]);

  useFrame(() => {
    refs.current.forEach((b, i) => {
      if (b) {
        b.position.add(b.userData.direction.clone().multiplyScalar(0.8));
      }
    });
  });

  return (
    <>
      {bullets.map((bullet, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={bullet.position}
          userData={{ direction: bullet.direction }}
        >
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}
    </>
  );
}
