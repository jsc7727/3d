import { useFrame, useThree } from "@react-three/fiber";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Vector3 } from "three";
import { useStore } from "./useStore";

const useAnotherPlayer = ({ socket, player: playerModule }: any) => {
  const [room, userList, setUserList, addUserList, setDisconnectUserList] =
    useStore((state: any) => [
      state.room,
      state.userList,
      state.setUserList,
      state.addUserList,
      state.setDisconnectUserList,
    ]);

  let meshRefs = useRef<any>({});

  useEffect(() => {
    socket.emit("join Room", { roomId: room });

    socket.on("setUserList", ({ userId, roomId, userList }: any) => {
      setUserList(userList.filter((v: string) => v !== socket.id));
    });

    socket.on("disconnectingAnotherUser", (userId: string) => {
      // console.log("disconnectingAnotherUser", userId);
      setDisconnectUserList(userId);
    });

    socket.on("position", ({ userId, position, rotation }: any) => {
      if (userId === socket.id) {
        // console.log(userId, socket.id);
        return;
      }
      if (userId in meshRefs.current) {
        meshRefs.current[userId].position = position;
        meshRefs.current[userId].rotation = rotation;
      } else {
        addUserList(userId);
        meshRefs.current[userId] = { position: null, rotation: null };
      }
    });

    const interval = setInterval(() => {
      socket.emit("position", {
        roomId: room,
        position: playerModule.pos.current,
        rotation: playerModule.group.current.rotation,
      });
    }, 16);

    return () => {
      socket.removeAllListeners();
      clearInterval(interval);
    }; // 이부분 없으면 렌더링 종료시에 socket 제거가 안됨.
  }, [room]);

  return { meshRefs, userList, socket };
};
export default useAnotherPlayer;
