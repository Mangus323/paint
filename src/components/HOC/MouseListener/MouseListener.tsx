import React, { JSX, ReactNode, createContext, useState } from "react";
import { useGlobalEventListener } from "@/hooks/useGlobalEventListener";
import { zoom } from "@/redux/slices/browser/reducer";
import { stopDraw } from "@/redux/slices/canvas/reducer";
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

  const onMouseMove = (_, e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const onWheel = (_, e: WheelEvent) => {
    if (e.ctrlKey) {
      dispatch(zoom(-e.deltaY || e.deltaX));
      e.preventDefault();
    }
  };

  const onMouseOver = () => {
    dispatch(stopDraw());
  };

  const onContextMenu = (_, e: MouseEvent) => {
    e.preventDefault();
  };

  useGlobalEventListener("document", "mousemove", onMouseMove);
  useGlobalEventListener("document", "mouseover", onMouseOver);
  useGlobalEventListener("document", "contextmenu", onContextMenu);
  useGlobalEventListener("window", "wheel", onWheel, {}, { passive: false });

  return (
    <>
      <MousePositionContext.Provider value={position}>
        {props.children}
      </MousePositionContext.Provider>
    </>
  );
};
