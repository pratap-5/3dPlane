import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Game from "./engine/Game";
import { Joystick } from "react-joystick-component";

export default function App() {
  const [controls, setControls] = useState({});

  // Detect if screen is mobile and in landscape
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);

  useEffect(() => {
    const checkOrientationAndSize = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      setIsMobileLandscape(isMobile && isLandscape);
    };

    checkOrientationAndSize();
    window.addEventListener("resize", checkOrientationAndSize);
    window.addEventListener("orientationchange", checkOrientationAndSize);

    return () => {
      window.removeEventListener("resize", checkOrientationAndSize);
      window.removeEventListener("orientationchange", checkOrientationAndSize);
    };
  }, []);

  const handleControl = (key, isPressed) => {
    setControls((prev) => ({ ...prev, [key.toLowerCase()]: isPressed }));
  };

  const joystick = useRef({ x: 0, y: 0, distance: 0 });

  return (
    <>
      <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
        <ambientLight />
        <directionalLight position={[5, 5, 5]} />
        <Environment preset="sunset" />
        <Game controls={controls} joystick={joystick.current} />
      </Canvas>

      {isMobileLandscape ? (
        <>
          {/* Joystick on the left side */}
          <div style={styles.joystickWrapper}>
            <Joystick
              size={100}
              baseColor="rgba(255, 255, 255, 0.3)"
              stickColor="rgba(100, 100, 255, 0.8)"
              move={(e) => {
                handleControl("ArrowUp", true);
                // console.log(e);
                joystick.current.x = e.x;
                joystick.current.y = e.y;
                joystick.current.distance = e.distance;

                // Normalize angle to determine direction
                const { direction } = e;
                // console.log("Joystick direction:", e);
                direction === "BACKWARD" && handleControl("ArrowUp", false);

                handleControl("ArrowDown", direction === "BACKWARD");

                handleControl("ArrowRight", direction === "RIGHT");
                handleControl("ArrowLeft", direction === "LEFT");
              }}
              stop={() => {
                joystick.current.x = 0;
                joystick.current.y = 0;
                joystick.current.distance = 0;
                // Reset controls when joystick is released
                handleControl("ArrowUp", false);
                handleControl("ArrowDown", false);
                handleControl("ArrowLeft", false);
                handleControl("ArrowRight", false);
              }}
            />
          </div>

          {/* Ascend/Descend + Fire */}
          <div style={styles.rightControls}>
            {/* <button
              style={styles.btn}
              onPointerDown={() => handleControl("x", true)}
              onPointerUp={() => handleControl("x", false)}
              onPointerLeave={() => handleControl("x", false)}
            >
              ⬇️
            </button>
            <button
              style={styles.btn}
              onPointerDown={() => handleControl("s", true)}
              onPointerUp={() => handleControl("s", false)}
              onPointerLeave={() => handleControl("s", false)}
            >
              ⬆️
            </button> */}

            <button
              style={styles.fireBtn}
              onPointerDown={() => handleControl("fire", true)}
              onPointerUp={() => handleControl("fire", false)}
              onPointerLeave={() => handleControl("fire", false)}
            >
              Fire
            </button>
          </div>
        </>
      ) : (
        window.matchMedia("(max-width: 768px)").matches && (
          <div style={styles.rotateMessage}>
            Please rotate your device to landscape mode for controls.
          </div>
        )
      )}
    </>
  );
}

const styles = {
  joystickWrapper: {
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 100,
  },

  rightControls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    position: "absolute",
    bottom: 35,
    right: 20,
    zIndex: 1000,
  },
  btn: {
    width: "4rem",
    height: "4rem",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    border: "1px solid #ccc",
    borderRadius: 12,
    cursor: "pointer",

    textAlign: "center",
  },
  fireBtn: {
    width: "5rem",
    height: "5rem",
    backgroundColor: "rgba(255, 0, 0, 0.5)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
  },
  rotateMessage: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    padding: 20,
    borderRadius: 12,
    fontSize: 18,
    textAlign: "center",
    zIndex: 2000,
    maxWidth: 300,
  },
};
