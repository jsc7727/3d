import { useFrame, useThree } from "@react-three/fiber";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Vector3 } from "three";
import Model from "./Model";

const Player2 = ({ meshRef }: any) => {
  return (
    <>
      <Model meshRef={meshRef} position={[0, 0, 0]}></Model>
    </>
  );
};
export default Player2;
