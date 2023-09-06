import { useRef } from "react";
import { edit, placeAndEdit } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;
import Vector2d = Konva.Vector2d;

export const useFigure = (offset: Vector2d) => {
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const { zoom } = useAppSelector(state => state.browser);
  const { activeElement, isActiveElement } = useActiveElement();
  const dispatch = useAppDispatch();
  const isDrawing = useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "ellipse" || tool === "rect") {
      isDrawing.current = true;
      const { x, y } = getPoints(e, zoom, offset);
      dispatch(
        placeAndEdit({
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
    if (!isDrawing.current) {
      return;
    }
    if (isActiveElement && "x" in activeElement) {
      dispatch(
        edit({
          width: x - activeElement.x,
          height: y - activeElement.y
        })
      );
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
