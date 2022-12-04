import { useFrame, useThree } from "@react-three/fiber";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Vector3 } from "three";
import { useStore } from "./useStore";

const useAnotherPlayer = ({ socket, player: playerModule }: any) => {
  const [room, setUsers] = useStore((state: any) => [
    state.room,
    state.setUsers,
  ]);

  let meshRefs = useRef<any>({});
  const [state, setState] = useState<any>([]);
  useEffect(() => {
    console.log("state", state);
  }, [state]);

  useEffect(() => {
    socket.emit("join Room", { roomId: room });

    // socket.on("join", ({ userId, roomId, userList }: any) => {
    //   console.log("state userList", userList);
    //   console.log("join", userList);
    //   setState(userList);
    // });

    socket.on("position", ({ userId, position, rotation }: any) => {
      if (userId in meshRefs.current) {
        meshRefs.current[userId].position = position;
        meshRefs.current[userId].rotation = rotation;
      } else {
        setState((prev: any) => [...prev, userId]);
        meshRefs.current[userId] = { position: null, rotation: null };
      }
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

  return { meshRefs, userList: state, socket };
};
export default useAnotherPlayer;
