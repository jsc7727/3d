import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4001");

type messageType = { name: string; message: string };

function Chat() {
  const [state, setState] = useState({ message: "", name: "" });
  const [chat, setChat] = useState<messageType[]>([]);
  const [room, setRoom] = useState("default");

  useEffect(() => {
    socket.emit("join Room", { roomId: room });
    socket.on("message", ({ name, message }: messageType) => {
      setChat((prev) => [...prev, { name, message }]);
    });
    return () => {
      socket.removeAllListeners();
    }; // 이부분 없으면 렌더링 종료시에 socket 제거가 안됨.
  }, []);
  // [] 안써주면 chat 바뀔때마다 socket.on 이 다시 정의됨. useEffect 살펴볼 것.
  // socket.on은 첫 렌더링 시기에 정의 되는데 이때 chat값이 reference 값으로 저장되어있으므로 문제가됨.

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    // socket.emit('disconnect Room', { roomId: room });
    socket.emit("join Room", { roomId });
    setChat([...chat, { name: "관리자", message: `${roomId} 로 방이 바뀜` }]);
    setRoom(roomId);
  };

  return (
    <>
      <div className="card">
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
        <div className="render-chat">
          <h1>Chat log</h1>
          {renderChat()}
        </div>
      </div>
    </>
  );
}

export default Chat;
