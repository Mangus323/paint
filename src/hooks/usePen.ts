import { useRef } from "react";
import { edit, placeAndEdit, stopDraw } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;

export const usePen = () => {
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const dispatch = useAppDispatch();
  const isDrawing = useRef(false);
  const { activeElement, isActiveElement } = useActiveElement();

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "pen" || tool === "eraser") {
      isDrawing.current = true;
      const { x, y } = getPoints(e);
      dispatch(
        placeAndEdit({
          points: [x, y],
          tool: tool
        })
      );
    }
  };

  const handleMouseMove = (x: number, y: number) => {
    if (!isDrawing.current) {
      return;
    }
    if (isActiveElement && "points" in activeElement) {
      dispatch(
        edit({
          points: activeElement.points.concat([x, y])
        })
      );
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    dispatch(stopDraw());
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp };
};
