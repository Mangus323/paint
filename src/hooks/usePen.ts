import React from "react";
import { place } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";

import KonvaEventObject = Konva.KonvaEventObject;

export const usePen = () => {
  const { selectedTool: tool } = useSelector(
    (state: RootState) => state.canvas
  );
  const dispatch: AppDispatch = useDispatch();
  const [lines, setLines] = React.useState<number[]>([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "pen" || tool === "eraser") {
      isDrawing.current = true;
      const { x, y } = getPoints(e);
      setLines([x, y]);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) {
      return;
    }
    let { x, y } = getPoints(e);
    let newPoints = lines.concat([x, y]);
    setLines(newPoints);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    if (tool === "pen" || tool === "eraser") {
      dispatch(
        place({
          points: lines,
          tool: tool
        })
      );

      setLines([]);
    }
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp, lines };
};
