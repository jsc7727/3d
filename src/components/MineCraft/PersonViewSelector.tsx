import { useEffect } from "react";
import { useStore } from "./../../hooks/useStore";
import { useKeyboard } from "./../../hooks/useKeyboard";

const PersonViewSelector = () => {
  const [changePersonView] = useStore((state: any) => [state.changeCameraView]);
  const { personView } = useKeyboard();

  useEffect(() => {
    if (personView === true) {
      changePersonView();
    }
  }, [changePersonView, personView]);

  return <></>;
};

export default PersonViewSelector;
