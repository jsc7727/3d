import { useFrame, useThree } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { AnimationAction, Quaternion, Vector3 } from "three";
import { useKeyboard } from "./../../hooks/useKeyboard";
import Soldier from "./../../model/Soldier.glb";
import { useAnimations, useGLTF } from "@react-three/drei";

const JUMP_FORCE = 4;
const SPEED = 4;

const Player = () => {
  const { moveBackward, moveForward, moveRight, moveLeft, jump } =
    useKeyboard();

  const { camera } = useThree();

  const group = useRef<any>();
  const current = useRef("Idle");
  const { nodes, materials, animations }: any = useGLTF(Soldier);
  const { actions } = useAnimations(animations, group);

  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 10, 0],
  }));

  // vel 을 구독해서 vel 값이 바뀌면 솔저랑 매칭됨.
  const vel = useRef([0, 0, 0]);

  useEffect(() => {
    api.velocity.subscribe((v) => {
      api.rotation.set(0, 0, 0);
      return (vel.current = [0, v[1], 0]);
    });
  }, [api.velocity, api.rotation]);

  const pos = useRef([0, 0, 0]);
  useEffect(() => {
    api.position.subscribe((p) => {
      api.rotation.set(0, 0, 0);
      return (pos.current = p);
    });
  }, [api.position, api.rotation]);

  const solderAnimation = () => {
    let currentAction: AnimationAction | null = null;
    let play = "";
    let toAction;

    if (current.current === "Walk") {
      currentAction = actions.Walk;
    } else {
      currentAction = actions.Idle;
    }
    const pressAny =
      Number(moveBackward) +
        Number(moveForward) +
        Number(moveRight) +
        Number(moveLeft) >
      0
        ? 1
        : 0;
    if (pressAny) {
      play = "Walk";
      toAction = actions.Walk;
    } else {
      play = "Idle";
      toAction = actions.Idle;
    }

    if (
      current.current !== play &&
      currentAction !== null &&
      toAction !== null
    ) {
      currentAction.fadeOut(0.2);
      toAction.reset().fadeIn(0.2).play();
      current.current = play;
    }

    if (current.current === "Walk") {
    }
  };

  useFrame(() => {
    const v = new Vector3(pos.current[0], pos.current[1], pos.current[2]);

    const res = new Vector3(0, -6, -10).applyEuler(camera.rotation);

    // Vector3.subVectors(v, res);
    v.x -= res.x;
    v.y -= res.y;
    v.z -= res.z;

    camera.position.copy(v);
    const direction = new Vector3();

    const frontVector = new Vector3(
      0,
      0,
      (moveBackward ? 1 : 0) - (moveForward ? 1 : 0)
    );

    const sideVector = new Vector3(
      (moveLeft ? 1 : 0) - (moveRight ? 1 : 0),
      0,
      0
    );

    direction
      .subVectors(frontVector, sideVector)
      .normalize() // 1로
      .multiplyScalar(SPEED) // 속도만큼 스칼라 증가
      .applyEuler(camera.rotation); // 카메라가 보는 방향으로 방향 설정 => 스칼라를 벡터로 만듬
    // .applyEuler(camera.rotation); // 카메라가 보는 방향으로 방향 설정 => 스칼라를 벡터로 만듬
    // .applyEuler(); // 카메라가 보는 방향으로 방향 설정 => 스칼라를 벡터로 만듬

    //오일러
    // - 짐벌락 현상이 일어남 => x y z 축을 각각 따로 체크하여 각도를 구하는데 회전하다가 두개의 축이 겹치는 경우 계산이 불가능함
    // 퀀터니언
    api.velocity.set(direction.x, vel.current[1], direction.z);
    solderAnimation();

    // 캐릭터 카메라 보는 방향으로 회전
    group.current.rotation.set(
      camera.rotation.x,
      camera.rotation.y,
      camera.rotation.z
    );

    if (jump && Math.abs(vel.current[1]) < 0.05) {
      api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2]);
    }
  });

  return (
    <mesh ref={ref as any}>
      <group ref={group as any} position={[0, 0, 0]} dispose={null}></group>
      <group ref={group as any} position={[0, 0, 0]} dispose={null}>
        <group name="Scene">
          <group
            name="Character"
            position={[0, -0.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            scale={0.01}
          >
            <primitive object={nodes.mixamorigHips} />
            <skinnedMesh
              name="vanguard_Mesh"
              geometry={nodes.vanguard_Mesh.geometry}
              material={materials.VanguardBodyMat}
              skeleton={nodes.vanguard_Mesh.skeleton}
            />
            <skinnedMesh
              name="vanguard_visor"
              geometry={nodes.vanguard_visor.geometry}
              material={materials.Vanguard_VisorMat}
              skeleton={nodes.vanguard_visor.skeleton}
            />
          </group>
        </group>
      </group>
    </mesh>
  );
};
export default Player;
