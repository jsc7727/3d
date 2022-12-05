import { Physics } from "@react-three/cannon";
import { Box, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Ground from "./../components/MineCraft/Ground";
import Player from "./../components/MineCraft/Player";
import FPV from "./../components/MineCraft/FPV";
//FPV 마우스 포인터 관련  https://drei.pmnd.rs/?path=/story/controls-pointerlockcontrols--pointer-lock-controls-scene-st-with-selector
import Cubes from "./../components/MineCraft/Cubes";
import Menu from "./../components/MineCraft/Menu";
import Player2 from "../components/MineCraft/Player2";
import useModel from "../hooks/useModel";
import useAnotherPlayer from "../hooks/useAnotherPlayer";
import PersonViewSelector from "../components/MineCraft/PersonViewSelector";
import Chat from "../components/Chat/Chat";
import { io } from "socket.io-client";
import { useEffect } from "react";
import Model from "../components/MineCraft/Model";

const socket = io("http://krkorea.iptime.org:4001");

function Inner() {
  const player = useModel();
  const { userList, ...anotherPlayer } = useAnotherPlayer({ socket, player });
  useEffect(() => {
    console.log("asdf?????");
  }, [userList]);
  return (
    <>
      <Player {...player} />
      {userList.map((userId: string) => {
        return (
          <Player2 key={userId} userId={userId} {...anotherPlayer}></Player2>
        );
      })}
    </>
  );
}

function MineCraft() {
  return (
    <>
      <Chat socket={socket} />
      <Canvas className="threejsCanvas" camera={{ fov: 75 }}>
        <Sky sunPosition={[100, 100, 20]} />
        <ambientLight intensity={0.5} />
        <FPV />
        <Physics>
          <Inner></Inner>
          <Cubes />
          <Ground />
        </Physics>
      </Canvas>
      <div className="absolute centered cursor">+</div>
      <PersonViewSelector />
      <Menu />
    </>
  );
}

export default MineCraft;
