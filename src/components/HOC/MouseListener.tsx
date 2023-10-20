"use client";

import React, {
  JSX,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState
} from "react";
import { ScrollContext } from "@/components/HOC/ScrollProvider";
import { sidebarDimension as sd } from "@/globals/globals";
import { useActiveElement } from "@/hooks/useActiveElement";
import { useGlobalEventListener } from "@/hooks/useGlobalEventListener";
import { set, setToast } from "@/redux/slices/browser/reducer";
import { stopDraw } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { calculateZoom } from "@/utils/math";
import Konva from "konva";

import Vector2d = Konva.Vector2d;

interface IMousePosition extends Vector2d {
  shiftKey: boolean;
}

export const MousePositionContext = createContext<IMousePosition>({
  x: 0,
  y: 0,
  shiftKey: false
});

interface MouseListenerProps {
  children: ReactNode;
}

export const MouseListener = (props: MouseListenerProps): JSX.Element => {
  const [position, setPosition] = useState<IMousePosition>({
    x: 0,
    y: 0,
    shiftKey: false
  });
  const dispatch = useAppDispatch();
  const { isDrawing } = useAppSelector(state => state.canvas);
  const browser = useAppSelector(state => state.browser);
  const { zoom } = browser;
  const { scroll, setScroll } = useContext(ScrollContext);
  const { setNewActiveElement } = useActiveElement();
  const { layerX, layerY } = scroll;
  const coordinate = {
    x: (position.x - sd.width - layerX) / zoom,
    y: (position.y - sd.height - layerY) / zoom
  };

  const onMouseMove = (_, e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY, shiftKey: e.shiftKey });
  };

  const onWheel = (state, e: WheelEvent) => {
    if (e.ctrlKey) {
      let newState = calculateZoom(state, -e.deltaY || e.deltaX);
      dispatch(set(newState));
      const { layerY, layerX, horizontalBar, verticalBar } = newState;
      setScroll({ layerX, layerY, horizontalBar, verticalBar });
      e.preventDefault();
    }
  };

  const onMouseOver = () => {
    if (isDrawing) dispatch(stopDraw());
  };

  const onContextMenu = (_, e: MouseEvent) => {
    e.preventDefault();
  };

  const onDrag = useCallback((_, e) => {
    e.preventDefault();
  }, []);

  const onDrop = useCallback((_, e: DragEvent) => {
    if (!e.dataTransfer) return;
    const item = [...e.dataTransfer.items].find(item =>
      item.type.match(/^image\//)
    );
    const file = item?.getAsFile();
    if (!file) return;
    e.preventDefault();
    const reader = new FileReader();

    let { x, y } = coordinate;
    reader.onloadend = () => {
      if (!reader.result) return;
      setNewActiveElement({
        tool: "image",
        src: reader.result,
        x,
        y
      });
      dispatch(setToast("dropped image"));
    };
    reader.readAsDataURL(file);
  }, []);

  useGlobalEventListener("window", "dragover", onDrag, {}, false);
  useGlobalEventListener("window", "drop", onDrop, {}, false);
  useGlobalEventListener("document", "mousemove", onMouseMove);
  useGlobalEventListener("document", "mouseover", onMouseOver);
  useGlobalEventListener("document", "contextmenu", onContextMenu);
  useGlobalEventListener(
    "window",
    "wheel",
    onWheel,
    { ...browser, ...scroll },
    { passive: false }
  );

  return (
    <>
      <MousePositionContext.Provider value={position}>
        {props.children}
      </MousePositionContext.Provider>
    </>
  );
};
