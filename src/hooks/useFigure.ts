import { useRef, useState } from "react";
import { place } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { IFigure } from "@/types/canvas";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";

import KonvaEventObject = Konva.KonvaEventObject;

export const useFigure = () => {
  const { selectedTool: tool } = useSelector(
    (state: RootState) => state.canvas
  );
  const dispatch: AppDispatch = useDispatch();
  const [startPoints, setStartPoints] = useState<number[]>([0, 0]);
  const [endPoints, setEndPoints] = useState<number[]>([0, 0]);
  const isDrawing = useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "ellipse" || tool === "rect") {
      isDrawing.current = true;
      const { x, y } = getPoints(e);
      setStartPoints([x, y]);
      setEndPoints([x, y]);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) {
      return;
    }
    let { x, y } = getPoints(e);
    let newPoints = [x, y];
    setEndPoints(newPoints);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    if (tool === "ellipse" || tool === "rect") {
      dispatch(
        place({
          width: endPoints[0] - startPoints[0],
          height: endPoints[1] - startPoints[1],
          x: startPoints[0],
          y: startPoints[1],
          tool: tool
        })
      );

      setEndPoints([0, 0]);
      setStartPoints([0, 0]);
    }
  };

  const cords: Omit<IFigure, "tool"> = {
    x: startPoints[0],
    y: startPoints[1],
    width: endPoints[0] - startPoints[0],
    height: endPoints[1] - startPoints[1]
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    cords
  };
};
