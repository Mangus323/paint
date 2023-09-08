import { useEffect, useRef } from "react";
import { edit, placeAndEdit } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;
import Vector2d = Konva.Vector2d;

export const useFigure = (offset: Vector2d) => {
  const { selectedTool: tool, isDrawing } = useAppSelector(
    state => state.canvas
  );
  const { zoom } = useAppSelector(state => state.browser);
  const settings = useAppSelector(state => state.settings).tools.rect;
  const { activeElement, isActiveElement } = useActiveElement();
  const dispatch = useAppDispatch();
  const isDrawingRef = useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "ellipse" || tool === "rect") {
      isDrawingRef.current = true;
      const { x, y } = getPoints(e, zoom, offset);
      dispatch(
        placeAndEdit({
          ...settings,
          width: 0,
          height: 0,
          x,
          y,
          tool: tool
        })
      );
    }
  };

  const handleMouseMove = (x: number, y: number) => {
    if (!isDrawingRef.current) return;
    if (isActiveElement && "height" in activeElement) {
      let xCond = x < activeElement.x;
      let yCond = y < activeElement.y;
      let next = {
        x: xCond ? x : activeElement.x,
        y: yCond ? y : activeElement.y,
        width: xCond
          ? Math.abs(x - activeElement.x) + activeElement.width
          : Math.abs(x - activeElement.x),
        height: Math.abs(activeElement.y - y)
      };
      dispatch(edit(next));
    }
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  useEffect(() => {
    if (!isDrawing) isDrawingRef.current = false;
  }, [isDrawing]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
