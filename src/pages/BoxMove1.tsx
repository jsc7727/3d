import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect } from "react";

const Box = () => {
  const myMesh = React.useRef<any>();

  const onKeyDownHandler = (e: any) => {
    console.log(e.key);
    switch (e.key) {
      case "ArrowLeft": {
        myMesh.current.position.x -= 1;
        break;
      }
      case "ArrowRight": {
        myMesh.current.position.x += 1;
        break;
      }
      case "ArrowUp": {
        myMesh.current.position.y += 1;

        break;
      }
      case "ArrowDown": {
        myMesh.current.position.y -= 1;
        break;
      }
      default:
        console.log("asdf?");
    }
  };

  useFrame(({ clock }) => {
    if (myMesh.current) {
      const a = clock.getElapsedTime();
      myMesh.current.rotation.x = a;
    }
  });

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownHandler);
  }, []);
  return (
    <mesh
      ref={myMesh}
      visible
      userData={{ hello: "world" }}
      position={[1, 1, 1]}
      rotation={[0.01, 0.01, 0.01]}
    >
      <meshBasicMaterial color={"black"} />
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
};

const AirPlain = () => {
  return (
    <div id="world">
      <Canvas>
        <group>
          <mesh
            visible
            userData={{ hello: "world" }}
            position={[1, 1, 1]}
            rotation={[0.01, 0.01, 0.01]}
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
export default AirPlain;
