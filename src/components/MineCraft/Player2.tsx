import { useFrame, useThree } from "@react-three/fiber";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Vector3 } from "three";

const socket = io("http://localhost:4001");

type positionType = [number, number, number];

const Player2 = () => {
  const { camera } = useThree();
  const [room, setRoom] = useState("default");
  const [state, setState] = useState<positionType>([0, 0, 0]);
  let meshRef = useRef<any>(null);

  useEffect(() => {
    socket.emit("join Room", { roomId: room });
    socket.on("position", ({ position }: any) => {
      console.log("position", position);
      setState(position);
    });
    const interval = setInterval(() => {
      socket.emit("position", { position: camera.position.toArray() });
    }, 16);
    return () => {
      socket.removeAllListeners();
      clearInterval(interval);
    }; // 이부분 없으면 렌더링 종료시에 socket 제거가 안됨.
  }, []);

  useFrame((time) => {
    if (meshRef.current !== null) {
      meshRef.current.position.set(...state);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
};
export default Player2;
