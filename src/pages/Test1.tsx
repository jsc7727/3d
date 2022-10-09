import React, { useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import Box from "../components/Box";
import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const DEG45 = Math.PI / 4;

const CameraController = () => {
  const { camera, gl } = useThree();
  useEffect(() => {
    const controls = new OrbitControls(camera, gl.domElement);
    controls.minDistance = 3;
    controls.maxDistance = 20;
    return () => {
      controls.dispose();
    };
  }, [camera, gl]);
  return null;
};

type PositionType = [number, number, number];

const Test1 = () => {
  const [position, setPosition] = useState<PositionType>([0, 0, 0]);

  function CameraHelper() {
    const camera = new PerspectiveCamera(15, 1.77, 3, 10);
    return <cameraHelper args={[camera]} />;
  }

  const onKeyDownHandler: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    console.log("press", e.key);
    switch (e.key) {
      case "ArrowLeft": {
        const newPosition: PositionType = [...position];
        newPosition[0] -= 1;
        setPosition(newPosition);
        break;
      }
      case "ArrowRight": {
        const newPosition: PositionType = [...position];
        newPosition[0] += 1;
        setPosition(newPosition);
        break;
      }
      case "ArrowUp": {
        const newPosition: PositionType = [...position];
        newPosition[1] += 1;
        setPosition(newPosition);
        break;
      }
      case "ArrowDown": {
        const newPosition: PositionType = [...position];
        newPosition[1] -= 1;
        setPosition(newPosition);
        break;
      }
      default:
        console.log("asdf?");
    }
  };

  return (
    <>
      <input onKeyDown={onKeyDownHandler}></input>
      {/* <Canvas camera={{ position: [2, 2, 2], fov: 90, near: 3, far: 3.5 }}> */}
      <Canvas camera={{ position: [2, 2, 2], fov: 90 }}>
        <ambientLight />
        {/* <pointLight position={[10, 10, 10]} /> */}
        <spotLight intensity={0.3} position={[5, 10, 50]} />
        <Box position={position} />
        <Box position={[1.2, 0, 0]} />
        <Box position={[2.2, 0, 0]} />
        <Box position={[3.2, 0, 0]} />
        <CameraHelper />
        <CameraController />
      </Canvas>
    </>
  );
};
export default Test1;
