import React, {
  JSX,
  ReactNode,
  createContext,
  useEffect,
  useState
} from "react";
import { zoom } from "@/redux/slices/browser/reducer";
import { useAppDispatch } from "@/redux/store";
import Konva from "konva";

import Vector2d = Konva.Vector2d;

export const MousePositionContext = createContext<Vector2d>({ x: 0, y: 0 });

interface MouseListenerProps {
  children: ReactNode;
}

export const MouseListener = (props: MouseListenerProps): JSX.Element => {
  const [position, setPosition] = useState<Vector2d>({ x: 0, y: 0 });
  const dispatch = useAppDispatch();

  const onMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) {
      dispatch(zoom(-e.deltaY || e.deltaX));
      e.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <>
      <MousePositionContext.Provider value={position}>
        {props.children}
      </MousePositionContext.Provider>
    </>
  );
};
