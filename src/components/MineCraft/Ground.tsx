import { usePlane } from "@react-three/cannon";
import textures from "./../../images/textures";
import { useStore } from "./../../hooks/useStore";

const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -1, 0],
  }));
  const [addCube] = useStore((state: any) => [state.addCube]);

  textures.groundTexture.repeat.set(1000, 1000);

  return (
    <mesh
      onClick={(e) => {
        e.stopPropagation();
        const [x, y, z] = Object.values(e.point).map((val) => Math.ceil(val));
        addCube(x, y, z);
      }}
      ref={ref as any}
    >
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshStandardMaterial attach="material" map={textures.groundTexture} />
    </mesh>
  );
};
export default Ground;
