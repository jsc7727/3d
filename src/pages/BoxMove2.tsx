import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useState } from "react";

const Box = () => {
  const myMesh = React.useRef<any>();

  const [keyPress, setKeyPress] = useState({
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
  });

  const onKeyDownHandler = (e: any) => {
    type keyTypes = keyof typeof keyPress;
    if (keyPress.hasOwnProperty(e.key)) {
      const key = e.key as keyTypes;
      setKeyPress((prev) => {
        if (prev[key] === true) return prev;
        const nKeyPress = { ...prev };
        nKeyPress[key] = true;
        return nKeyPress;
      });
    }
  };
  const onKeyUpHandler = (e: any) => {
    type keyTypes = keyof typeof keyPress;
    if (keyPress.hasOwnProperty(e.key)) {
      const key = e.key as keyTypes;
      setKeyPress((prev) => {
        if (prev[key] === false) return prev;
        const nKeyPress = { ...prev };
        nKeyPress[key] = false;
        return nKeyPress;
      });
    }
  };

  useFrame(({ clock }, delta) => {
    const speed = 5;
    if (myMesh.current) {
      for (let [key, value] of Object.entries(keyPress))
        if (value === false) continue;
        else {
          switch (key) {
            case "ArrowLeft": {
              myMesh.current.position.x -= speed * delta;
              break;
            }
            case "ArrowRight": {
              myMesh.current.position.x += speed * delta;
              break;
            }
            case "ArrowUp": {
              myMesh.current.position.y += speed * delta;

              break;
            }
            case "ArrowDown": {
              myMesh.current.position.y -= speed * delta;
              break;
            }
            default:
              console.log("asdf?");
          }
        }
    }
  });

  useFrame(({ clock }) => {
    if (myMesh.current) {
      const a = clock.getElapsedTime();
      // console.log(a);
      myMesh.current.rotation.x = a;
    }
  });

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownHandler);
    document.addEventListener("keyup", onKeyUpHandler);
  }, []);
  return (
    <mesh
      ref={myMesh}
      visible
      position={[1, 1, 1]}
      rotation={[0.01, 0.01, 0.01]}
    >
      <meshBasicMaterial color={"black"} />
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
};

const BoxMove2 = () => {
  return (
    <div id="world">
      <Canvas>
        <group>
          <mesh
            visible
            userData={{ hello: "world" }}
            position={[1, 1, 1]}
            // rotation={[0.01, 0.01, 0.01]}
          >
            <meshBasicMaterial color={"black"} />
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        </group>
        <Box></Box>
        <ambientLight args={[0xff0000]} intensity={0.1} />
        <directionalLight position={[0, 0, 5]} intensity={0.5} />
      </Canvas>
    </div>
  );
};
export default BoxMove2;
