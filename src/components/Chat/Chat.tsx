import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useStore } from "../../hooks/useStore";

type messageType = { name: string; message: string };

function Chat({ socket }: any) {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState<messageType[]>([]);
  const [room, setRoom] = useStore((state: any) => [state.room, state.setRoom]);

  useEffect(() => {
    socket.on("message", ({ name, message }: messageType) => {
      setChat((prev) => [...prev, { name, message }]);
    });

    socket.on("disconnectUser", ({ name }: any) => {
      console.log(name);
    });
    return () => {
      socket.emit("disconnectUser");
      socket.removeAllListeners();
    };
  }, []);

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const onMessageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, message } = state;
    socket.emit("message", { roomId: room, name, message });
    setState({ message: "", name });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}:<span>{message}</span>
        </h3>
      </div>
    ));
  };

  const selectRoom = async (roomId: string) => {
    socket.emit("join Room", { roomId });
    setChat([...chat, { name: "관리자", message: `${roomId} 로 방이 바뀜` }]);
    setRoom(roomId);
  };

  return (
    <>
      <div
        style={{
          width: "400px",
          height: "100px",
          position: "fixed",
          right: 0,
          top: 0,
          zIndex: 10,
        }}
      >
        <form onSubmit={onMessageSubmit}>
          <div>현재 조인된 룸 : {room}</div>
          <h1>Message</h1>
          <div>{state.name}</div>
          <div className="name-field">
            <input
              name="name"
              onChange={(e) => onTextChange(e)}
              value={state.name}
            />
          </div>
          <div>
            <input
              name="message"
              onChange={(e) => onTextChange(e)}
              value={state.message}
              id="outlined-multiline-static"
            />
          </div>
          <button>Send Message</button>
          <br />
          <button onClick={() => selectRoom("default")}>공용방</button>{" "}
          <button onClick={() => selectRoom("btc")}>비트코인 방</button>{" "}
          <button onClick={() => selectRoom("eth")}>이더리움 방</button>{" "}
        </form>
        <div
          className="render-chat"
          style={{ height: "300px", overflow: "scroll" }}
        >
          <h1>Chat log</h1>
          {renderChat()}
        </div>
      </div>
    </>
  );
}

export default Chat;
