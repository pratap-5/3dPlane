
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import Bullet from "../components/Bullet";
import Enemy from "../components/Enemy";
import Plane from "../components/Plane";

export default function Game({ controls }) {
  const planeRef = useRef();
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);

  const handleFire = (position, direction) => {
    setBullets((prev) => [...prev, { position, direction }]);
  };

  useFrame(() => {
    setEnemies((prev) =>
      prev.filter((enemy) =>
        !bullets.some((b) => b.position.distanceTo(enemy.position) < 1)
      )
    );
  });

  useFrame(() => {
    if (Math.random() < 0.01) {
      if (planeRef.current) {
        const { x, y, z } = planeRef.current.position;
        setEnemies((prev) => [
          ...prev,
          { position: { x: x + Math.random() * 10 - 5, y, z: z - 50 } },
        ]);
      }
    }
  });

  return (
    <>
      <Plane ref={planeRef} onFire={handleFire} controls={controls} />
      {bullets.map((b, i) => (
        <Bullet key={i} start={b.position} direction={b.direction} />
      ))}
      {enemies.map((e, i) => (
        <Enemy key={i} position={e.position} />
      ))}
    </>
  );
}
