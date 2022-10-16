import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { DoubleSide } from "three";

const Box = () => {
  const myMesh = React.useRef<any>();
  let canJump = useRef(true);
  let defaultJumpSpeed = 20;
  let jumpSpeed = useRef(0);

  const [keyPress, setKeyPress] = useState({
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    " ": false,
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

  useFrame(({ camera }, delta) => {
    const speed = 20;
    myMesh.current.position.x +=
      Number(keyPress.ArrowRight) * speed * delta -
      Number(keyPress.ArrowLeft) * speed * delta;

    myMesh.current.position.z +=
      Number(keyPress.ArrowDown) * speed * delta -
      Number(keyPress.ArrowUp) * speed * delta;

    if (keyPress[" "] && canJump.current === true) {
      canJump.current = false;
      jumpSpeed.current = defaultJumpSpeed;
    }
    myMesh.current.position.y += jumpSpeed.current * delta;
    if (canJump.current === false) {
      jumpSpeed.current -= (defaultJumpSpeed + (9.8 / 2) * delta) * delta;
      console.log(jumpSpeed);
      if (myMesh.current.position.y <= 1) {
        jumpSpeed.current = 0;
        canJump.current = true;
        myMesh.current.position.y = 1;
      }
    }
    camera.position.x = myMesh.current.position.x;
    camera.position.y = myMesh.current.position.y + 5;
    camera.position.z = myMesh.current.position.z + 5;
    camera.rotation.x = (-Math.PI * 100) / 360;
  });

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownHandler);
    document.addEventListener("keyup", onKeyUpHandler);
  }, []);

  return (
    <mesh ref={myMesh} visible position={[1, 1, 1]}>
      <meshBasicMaterial color={"black"} />
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
};

const Plane = () => {
  return (
    <mesh position={[0, -2, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <meshPhongMaterial
        color={"0x25004D"}
        side={DoubleSide}
      ></meshPhongMaterial>
      <planeBufferGeometry args={[30, 30]}></planeBufferGeometry>
    </mesh>
  );
};

const BoxMove3 = () => {
  return (
    <div id="world">
      <Canvas camera={{ position: [0, 0, 8], fov: 90 }}>
        <Box></Box>
        <Plane></Plane>
        <ambientLight args={[0xff0000]} intensity={0.1} />
        <directionalLight position={[0, 0, 5]} intensity={0.5} />
      </Canvas>
    </div>
  );
};
export default BoxMove3;
