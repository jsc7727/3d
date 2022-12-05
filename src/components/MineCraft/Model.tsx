import * as THREE from "three";
import React, { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations, Clone } from "@react-three/drei";
import { GLTF } from "three-stdlib";

import RobotExpressive from "./../../model/RobotExpressive.glb";
import { AnimationClip } from "three";
import { useSphere } from "@react-three/cannon";
// import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import { useGraph, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

type GLTFResult = GLTF & {
  nodes: {
    FootL_1: THREE.Mesh;
    LowerLegL_1: THREE.Mesh;
    LegL: THREE.Mesh;
    LowerLegR_1: THREE.Mesh;
    LegR: THREE.Mesh;
    Head_2: THREE.Mesh;
    Head_3: THREE.Mesh;
    Head_4: THREE.Mesh;
    ArmL: THREE.Mesh;
    ShoulderL_1: THREE.Mesh;
    ArmR: THREE.Mesh;
    ShoulderR_1: THREE.Mesh;
    Torso_2: THREE.Mesh;
    Torso_3: THREE.Mesh;
    FootR_1: THREE.Mesh;
    HandR_1: THREE.SkinnedMesh;
    HandR_2: THREE.SkinnedMesh;
    HandL_1: THREE.SkinnedMesh;
    HandL_2: THREE.SkinnedMesh;
    Bone: THREE.Bone;
  };
  materials: {
    Grey: THREE.MeshStandardMaterial;
    Main: THREE.MeshStandardMaterial;
    Black: THREE.MeshStandardMaterial;
  };
};

type ActionName =
  | "Dance"
  | "Death"
  | "Idle"
  | "Jump"
  | "No"
  | "Punch"
  | "Running"
  | "Sitting"
  | "Standing"
  | "ThumbsUp"
  | "Walking"
  | "WalkJump"
  | "Wave"
  | "Yes"
  | "tracks"
  | "blendMode"
  | "duration";

type test = JSX.IntrinsicElements["group"];

export default function Model(props: any) {
  const { meshRef, ...etc } = props;

  const { scene } = useLoader(GLTFLoader, RobotExpressive) as any;
  const copiedScene = useMemo(() => scene.clone(), [scene]);

  // const [ref, api] = useSphere(() => ({
  //   mass: 1,
  //   type: "Static",
  //   position: [0, 0, 0],
  //   fixedRotation: true,
  // }));

  return (
    <group ref={meshRef} {...etc} dispose={null}>
      {/* <mesh ref={ref as any}> */}
      <primitive
        object={copiedScene}
        rotation={[0, Math.PI, 0]}
        position={[0, 0, 0]}
        scale={0.3}
      />
      {/* </mesh> */}
    </group>
  );
}

useGLTF.preload("/RobotExpressive.glb");
