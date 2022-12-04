import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useStore } from "../../hooks/useStore";
import Model from "./Model";

const Player2 = ({ userId, meshRefs }: any) => {
  const ref = useRef<any>(null);

  useFrame(() => {
    if (userId in meshRefs.current && ref.current !== null) {
      const { position, rotation } = meshRefs.current[userId];
      if (position !== null) ref.current.position.set(...position);
      if (rotation !== null) ref.current.rotation.copy(rotation);
    }
  });

  return (
    <>
      <Model meshRef={ref} position={[0, 0, 0]}></Model>
    </>
  );
};
export default Player2;
