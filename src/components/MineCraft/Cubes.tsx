import { useStore } from "./../../hooks/useStore";
import Cube from "./Cube";

const Cubes = () => {
  const [cubes] = useStore((state: any) => [state.cubes]);
  return cubes.map(({ key, pos, texture }: any) => {
    return <Cube key={key} position={pos} texture={texture} />;
  });
};
export default Cubes;
