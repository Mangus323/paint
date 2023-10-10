"use client";

import React, {
  JSX,
  ReactNode,
  createContext,
  useContext,
  useState
} from "react";
import { ScrollContext } from "@/components/HOC/ScrollProvider";
import { sp } from "@/globals/globals";
import { useGlobalEventListener } from "@/hooks/useGlobalEventListener";
import { BrowserState, set } from "@/redux/slices/browser/reducer";
import { stopDraw } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IScroll } from "@/types/canvas";
import Konva from "konva";

import Vector2d = Konva.Vector2d;

export const MousePositionContext = createContext<Vector2d>({ x: 0, y: 0 });

interface MouseListenerProps {
  children: ReactNode;
}

export const MouseListener = (props: MouseListenerProps): JSX.Element => {
  const [position, setPosition] = useState<Vector2d>({ x: 0, y: 0 });
  const dispatch = useAppDispatch();
  const { isDrawing } = useAppSelector(state => state.canvas);
  const browser = useAppSelector(state => state.browser);
  const { scroll, setScroll } = useContext(ScrollContext);

  const onMouseMove = (_, e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
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

  const calculateZoom = (state: IScroll & BrowserState, delta: number) => {
    const result = {
      ...state
    };
    let nextZoom = state.zoom;
    if (delta > 0) nextZoom *= 2;
    else nextZoom /= 2;
    result.zoom = nextZoom;

    const {
      canvasHeight,
      canvasWidth,
      layerHeight,
      layerWidth,
      layerX,
      layerY,
      verticalBar,
      horizontalBar
    } = state;

    const innerWidth = layerWidth * nextZoom;
    const availableWidth = canvasWidth - sp * 2 - 100;
    const nextLayerX = Math.max(
      layerX,
      canvasWidth > innerWidth ? 0 : canvasWidth - innerWidth
    );
    if (nextLayerX !== layerX) {
      result.layerX = nextLayerX;
      result.horizontalBar.x = Math.min(horizontalBar.x, layerWidth * nextZoom);
    }
    result.horizontalBar.x =
      (nextLayerX / (canvasWidth - innerWidth)) * availableWidth + sp;
    // copy for Y
    const innerHeight = layerHeight * nextZoom;
    const availableHeight = canvasHeight - sp * 2 - 100;
    const nextLayerY = Math.max(
      layerY,
      canvasHeight > innerHeight ? 0 : canvasHeight - innerHeight
    );
    if (nextLayerY !== layerY) {
      result.layerY = nextLayerY;
      result.verticalBar.y = Math.min(verticalBar.y, layerHeight * nextZoom);
    }
    result.verticalBar.y =
      (nextLayerY / (canvasHeight - innerHeight)) * availableHeight + sp;

    return result;
  };

  const onMouseOver = () => {
    if (isDrawing) dispatch(stopDraw());
  };

  const onContextMenu = (_, e: MouseEvent) => {
    e.preventDefault();
  };

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
