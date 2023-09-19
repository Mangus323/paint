import { useContext } from "react";
import { ActiveElementContext } from "@/components/HOC/ActiveElementProvider/ActiveElementProvider";
import { IElement } from "@/types/canvas";

export const useActiveElement = () => {
  const { element, setElement } = useContext(ActiveElementContext);

  const setNewActiveElement = (element: IElement) => {
    setElement(null);
    setTimeout(() => setElement(element), 0);
  };

  return {
    activeElement: element,
    setActiveElement: setElement,
    setNewActiveElement
  };
};
