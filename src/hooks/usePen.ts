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
    if (tool === "pen" || tool === "eraser" || tool === "line") {
      isDrawing.current = true;
      const { x, y } = getPoints(e);
      dispatch(
        placeAndEdit({
          points: [x, y],
          tool: tool,
          x: 0,
          y: 0
        })
      );
    }
  };

  const handleMouseMove = (x: number, y: number) => {
    if (!isDrawing.current) {
      return;
    }
    if (isActiveElement && "points" in activeElement) {
      if (tool === "line") {
        let p1 = activeElement.points[0];
        let p2 = activeElement.points[1];
        dispatch(
          edit({
            points: [p1, p2, x, y]
          })
        );
        return;
      }

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
