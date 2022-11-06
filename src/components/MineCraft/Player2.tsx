import { useFrame, useThree } from "@react-three/fiber";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4001");

type positionType = [number, number, number];

const Player2 = () => {
  const { camera } = useThree();
  const [room, setRoom] = useState("default");
  const [state, setState] = useState<positionType>([0, 0, 0]);

  useEffect(() => {
    socket.emit("join Room", { roomId: room });
    socket.on("position", ({ position }: any) => {
      console.log("position", position);
      setState(position);
    });
    const interval = setInterval(() => {
      socket.emit("position", { position: camera.position.toArray() });
    }, 1000);
    return () => {
      socket.removeAllListeners();
      clearInterval(interval);
    }; // 이부분 없으면 렌더링 종료시에 socket 제거가 안됨.
  }, []);

  // useFrame((time) => {
  //   console.log(time);
  //   console.log(camera.position.toArray());
  //   // socket.emit("message", { roomId });
  // });
  return (
    <mesh position={state}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={"orange"} />
    </mesh>
  );
};
export default Player2;
