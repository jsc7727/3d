import { useFrame, useThree } from "@react-three/fiber";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Vector3 } from "three";

const socket = io("http://localhost:4001");

const useAnotherPlayer = (playerModule: any) => {
  const [room, setRoom] = useState("default");
  let meshRef = useRef<any>(null);

  useEffect(() => {
    socket.emit("join Room", { roomId: room });
    socket.on("position", ({ position, rotation }: any) => {
      meshRef.current.position.set(...position);
      console.log(position, rotation);
      meshRef.current.rotation.copy(rotation);
    });
    const interval = setInterval(() => {
      socket.emit("position", {
        position: playerModule.pos.current,
        rotation: playerModule.group.current.rotation,
      });
    }, 16);
    return () => {
      socket.removeAllListeners();
      clearInterval(interval);
    }; // 이부분 없으면 렌더링 종료시에 socket 제거가 안됨.
  }, []);

  return { meshRef, room, setRoom };
};
export default useAnotherPlayer;
