import { useRef } from "react";
import { edit, placeAndEdit, stopDraw } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;

export const useFigure = () => {
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const { activeElement, isActiveElement } = useActiveElement();
  const dispatch = useAppDispatch();
  const isDrawing = useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "ellipse" || tool === "rect") {
      isDrawing.current = true;
      const { x, y } = getPoints(e);
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
    dispatch(stopDraw());
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
