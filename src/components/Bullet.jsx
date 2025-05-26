import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function Bullet({ start, direction }) {
  const bulletRef = useRef();
  const position = useRef(new THREE.Vector3(start.x, start.y, start.z));
  const velocity = useRef(
    new THREE.Vector3(direction.x, direction.y, direction.z)
      .normalize()
      .multiplyScalar(-1.5)
  );

  useFrame(() => {
    if (bulletRef.current) {
      position.current.add(velocity.current);
      bulletRef.current.position.copy(position.current);
    }
  });

  return (
    <mesh ref={bulletRef} position={[start.x, start.y, start.z]}>
      <sphereGeometry args={[0.2, 8, 8]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}
