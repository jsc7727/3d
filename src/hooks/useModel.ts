import { useFrame, useThree } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { useEffect, useRef } from "react";
import { AnimationAction, Quaternion, Vector3 } from "three";
import Soldier from "./../model/Soldier.glb";
import { useAnimations, useGLTF } from "@react-three/drei";
import { useKeyboard } from "./useKeyboard";

const JUMP_FORCE = 4;
const SPEED = 10;

const useModel = () => {
  const { moveBackward, moveForward, moveRight, moveLeft, jump } =
    useKeyboard();

  const { camera } = useThree();

  const group = useRef<any>();
  const current = useRef("Idle");
  const { nodes, materials, animations }: any = useGLTF(Soldier);
  const { actions } = useAnimations(animations, group);

  const [mesh, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 0, 0],
    // https://pmndrs.github.io/cannon-es/docs/classes/Body.html#fixedRotation
    // 이게 있으면 rotation을 건드리지 않음
    fixedRotation: true,
  }));

  // vel 을 구독해서 vel 값이 바뀌면 솔저랑 매칭됨.
  const vel = useRef([0, 0, 0]);

  useEffect(() => {
    api.velocity.subscribe((v) => {
      return (vel.current = [0, v[1], 0]);
    });
  }, [api.velocity]);

  const pos = useRef([0, 0, 0]);
  useEffect(() => {
    api.position.subscribe((p) => {
      return (pos.current = p);
    });
  }, [api.position]);

  const solderAnimation = () => {
    let currentAction: AnimationAction | null = null;
    let play = "";
    let toAction;

    if (current.current === "Run") {
      currentAction = actions.Run;
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
      play = "Run";
      toAction = actions.Run;
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

  const CameraPosition = () => {
    const cameraPositionToBehind = new Vector3(0, -4, -10).applyEuler(
      camera.rotation
    );
    const newCameraPosition = new Vector3(...pos.current).sub(
      cameraPositionToBehind
    );
    camera.position.copy(newCameraPosition);
  };

  const moveCharacter = () => {
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

    api.velocity.set(direction.x, vel.current[1], direction.z);

    if (jump && Math.abs(vel.current[1]) < 0.05) {
      api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2]);
    }

    // 캐릭터 카메라 보는 방향으로 회전
    // console.log(camera.rotation);
    group.current.rotation.set(
      camera.rotation.x,
      camera.rotation.y,
      camera.rotation.z
    );
    // group.current.rotation.set(0, camera.rotation.y, 0);
  };

  useFrame(() => {
    CameraPosition();
    moveCharacter();
    solderAnimation();
  });

  return { group, mesh, pos, nodes, materials };
};
export default useModel;
