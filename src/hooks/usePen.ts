import { useRef } from "react";
import { edit, placeAndEdit, stopDraw } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";

import KonvaEventObject = Konva.KonvaEventObject;

export const usePen = () => {
  const { selectedTool: tool, activeElement } = useSelector(
    (state: RootState) => state.canvas
  );
  const dispatch: AppDispatch = useDispatch();
  const isDrawing = useRef(false);

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

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) {
      return;
    }
    let { x, y } = getPoints(e);
    if (activeElement && "points" in activeElement) {
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
