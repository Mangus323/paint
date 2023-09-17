import { useEffect, useRef } from "react";
import { edit, placeAndEdit } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IPen } from "@/types/canvas";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;
import Vector2d = Konva.Vector2d;

export const usePen = (offset: Vector2d) => {
  const { selectedTool: tool, isDrawing } = useAppSelector(
    state => state.canvas
  );
  const { zoom } = useAppSelector(state => state.browser);
  const settings = useAppSelector(state => state.settings).tools;
  const { activeElement, isActiveElement } = useActiveElement();
  const dispatch = useAppDispatch();
  const isDrawingRef = useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "pen" || tool === "eraser" || tool === "line") {
      const toolSettings = settings[tool];
      isDrawingRef.current = true;
      const { x, y } = getPoints(e, zoom, offset);
      dispatch(
        placeAndEdit({
          points: [x, y],
          tool: tool,
          x: 0,
          y: 0,
          ...(toolSettings as any)
        })
      );
    }
  };

  const handleMouseMove = (x: number, y: number) => {
    if (!isDrawingRef.current) {
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
    if (isDrawingRef.current) {
      dispatch(edit(normalizePoints(activeElement as IPen)));
    }
    isDrawingRef.current = false;
  };

  useEffect(() => {
    if (!isDrawing) isDrawingRef.current = false;
  }, [isDrawing]);

  return { handleMouseDown, handleMouseMove, handleMouseUp };
};

const normalizePoints = (element: IPen): IPen => {
  const points = element.points;
  let maxX = 0,
    minX = Infinity,
    maxY = 0,
    minY = Infinity;
  for (let i = 0; i < points.length; i += 2) {
    minX = Math.min(minX, points[i]);
    maxX = Math.max(maxX, points[i]);
  }
  for (let i = 1; i < points.length; i += 2) {
    minY = Math.min(minY, points[i]);
    maxY = Math.max(maxY, points[i]);
  }
  const newPoints = points.map((point, index) => {
    return index % 2 === 0 ? point - minX : point - minY;
  });
  const width = maxX - minX;
  const height = maxY - minY;

  return {
    ...element,
    points: newPoints,
    x: minX + width / 2,
    y: minY + height / 2,
    offsetX: width / 2,
    offsetY: height / 2
  };
};
