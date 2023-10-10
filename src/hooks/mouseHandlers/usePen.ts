import { useContext, useEffect, useRef } from "react";
import { ScrollContext } from "@/components/HOC/ScrollProvider";
import { useActiveElement } from "@/hooks/useActiveElement";
import { useSettings } from "@/redux/slices/settings/selectors";
import { useAppSelector } from "@/redux/store";
import { IPen } from "@/types/canvas";
import { getPoints } from "@/utils/getCanvasPoints";
import { twoPointsToSmoothPoints } from "@/utils/math";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;

export const usePen = () => {
  const { layerX, layerY } = useContext(ScrollContext).scroll;
  const { selectedTool: tool, isDrawing } = useAppSelector(
    state => state.canvas
  );
  const { zoom } = useAppSelector(state => state.browser);
  const settings = useSettings(tool);
  const isDrawingRef = useRef(false);
  const { setActiveElement, activeElement, setNewActiveElement } =
    useActiveElement();

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "pen" || tool === "eraser" || tool === "line") {
      isDrawingRef.current = true;
      const { x, y } = getPoints(e, zoom, {
        x: layerX,
        y: layerY
      });
      setNewActiveElement({
        points: [x, y],
        tool: tool,
        x: 0,
        y: 0,
        ...settings
      });
    }
  };

  const handleMouseMove = (
    e: KonvaEventObject<MouseEvent>,
    x: number,
    y: number
  ) => {
    if (!isDrawingRef.current) return;
    if (!(activeElement && "points" in activeElement)) return;

    if (tool === "line") {
      const p1 = activeElement.points[0];
      const p2 = activeElement.points[1];

      if (e.evt.shiftKey) {
        const smoothPoints = twoPointsToSmoothPoints([p1, p2, x, y], 8);

        setActiveElement({
          ...activeElement,
          points: smoothPoints
        });
        return;
      }

      setActiveElement({
        ...activeElement,
        points: [p1, p2, x, y]
      });
    }
    if (tool !== "line") {
      setActiveElement({
        ...activeElement,
        points: activeElement.points.concat([x, y])
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawingRef.current && activeElement) {
      setActiveElement(normalizePoints(activeElement as IPen));
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
