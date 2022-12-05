import React, { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";

type useSocketProps = {
  socket: Socket;
  roomId: string;
  eventType: string;
  callback?: () => void;
};

const useSocket = <T>({
  roomId,
  eventType,
  socket,
  callback,
}: useSocketProps) => {
  const [state, setState] = useState<T[]>([]);
  useEffect(() => {
    socket.emit("join Room", { roomId });
    socket.on(eventType, (el: T) => {
      setState((prev) => [...prev, el]);
    });
    return () => {
      socket.removeAllListeners();
    }; // 이부분 없으면 렌더링 종료시에 socket 제거가 안됨.
  }, []);
  return { state, setState };
};
export default useSocket;
