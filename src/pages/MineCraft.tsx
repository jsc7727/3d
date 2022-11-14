import { Physics } from "@react-three/cannon";
import { Box, Sky } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Ground from "./../components/MineCraft/Ground";
import Player from "./../components/MineCraft/Player";
import FPV from "./../components/MineCraft/FPV";
//FPV 마우스 포인터 관련  https://drei.pmnd.rs/?path=/story/controls-pointerlockcontrols--pointer-lock-controls-scene-st-with-selector
import Cubes from "./../components/MineCraft/Cubes";
import TextureSelector from "./../components/MineCraft/TextureSelector";
import Menu from "./../components/MineCraft/Menu";
import Player2 from "../components/MineCraft/Player2";

function MineCraft() {
  return (
    <>
      <Canvas camera={{ fov: 75 }}>
        <Sky sunPosition={[100, 100, 20]} />
        <ambientLight intensity={0.5} />
        <FPV />
        <Physics>
          {/* <Player2 /> */}
          <Player />
          <Player2 />
          <Cubes />
          <Ground />
        </Physics>
      </Canvas>
      <div className="absolute centered cursor">+</div>
      <TextureSelector />
      <Menu />
    </>
  );
}

export default MineCraft;
