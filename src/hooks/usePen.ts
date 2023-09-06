import { useRef } from "react";
import { edit, placeAndEdit } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;
import Vector2d = Konva.Vector2d;

export const usePen = (offset: Vector2d) => {
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const { zoom } = useAppSelector(state => state.browser);
  const dispatch = useAppDispatch();
  const isDrawing = useRef(false);
  const { activeElement, isActiveElement } = useActiveElement();

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "pen" || tool === "eraser" || tool === "line") {
      isDrawing.current = true;
      const { x, y } = getPoints(e, zoom, offset);
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
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp };
};
