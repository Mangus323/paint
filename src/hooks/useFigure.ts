import { useEffect, useRef } from "react";
import { useActiveElement } from "@/hooks/useActiveElement";
import { useSettings } from "@/redux/slices/settings/selectors";
import { useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;

export const useFigure = () => {
  const { selectedTool: tool, isDrawing } = useAppSelector(
    state => state.canvas
  );
  const { zoom, layerX, layerY } = useAppSelector(state => state.browser);
  const rectSettings = useSettings("rect");
  const ellipseSettings = useSettings("ellipse");
  const { activeElement, setActiveElement, setNewActiveElement } =
    useActiveElement();
  const isDrawingRef = useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "ellipse" || tool === "rect") {
      isDrawingRef.current = true;
      const { x, y } = getPoints(e, zoom, {
        x: layerX,
        y: layerY
      });
      const data = {
        width: 0,
        height: 0,
        x,
        y,
        startX: x,
        startY: y,
        tool: tool
      };

      setNewActiveElement(
        tool === "ellipse"
          ? {
              ...ellipseSettings,
              ...data,
              radiusX: 0,
              radiusY: 0,
              tool: "ellipse"
            }
          : { ...rectSettings, ...data, cornerRadius: 0, tool: "rect" }
      );
    }
  };

  const handleMouseMove = (x: number, y: number) => {
    if (!isDrawingRef.current) return;
    if (activeElement && "startX" in activeElement) {
      setActiveElement({
        ...activeElement,
        x: Math.min(activeElement.startX, x),
        y: Math.min(activeElement.startY, y),
        width: Math.abs(activeElement.startX - x),
        height: Math.abs(activeElement.startY - y)
      });
    }
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  useEffect(() => {
    if (!isDrawing) isDrawingRef.current = false;
  }, [isDrawing]);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};
