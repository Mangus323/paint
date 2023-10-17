import { useContext, useEffect, useRef } from "react";
import { ScrollContext } from "@/components/HOC/ScrollProvider";
import { useActiveElement } from "@/hooks/useActiveElement";
import { useSettings } from "@/redux/slices/settings/selectors";
import { useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;

export const useFigure = () => {
  const { layerX, layerY } = useContext(ScrollContext).scroll;
  const { selectedTool: tool, isDrawing } = useAppSelector(
    state => state.canvas
  );
  const { zoom } = useAppSelector(state => state.browser);
  const rectSettings = useSettings("rect");
  const ellipseSettings = useSettings("ellipse");
  const polygonSettings = useSettings("polygon");
  const { activeElement, setActiveElement, setNewActiveElement } =
    useActiveElement();
  const isDrawingRef = useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "ellipse" || tool === "rect" || tool === "polygon") {
      isDrawingRef.current = true;
      const { x, y } = getPoints(e, zoom, {
        x: layerX,
        y: layerY
      });
      const defaultProps = {
        width: 0,
        height: 0,
        x,
        y,
        startX: x,
        startY: y,
        tool: tool
      };

      switch (tool) {
        case "ellipse":
          setNewActiveElement({
            ...ellipseSettings,
            ...defaultProps,
            radiusX: 0,
            radiusY: 0,
            tool: "ellipse"
          });
          return;
        case "rect":
          setNewActiveElement({
            ...rectSettings,
            ...defaultProps,
            cornerRadius: 0,
            tool: "rect"
          });
          return;
        case "polygon":
          setNewActiveElement({
            ...polygonSettings,
            ...defaultProps,
            tool: "polygon"
          });
      }
    }
  };

  const handleMouseMove = (
    e: KonvaEventObject<MouseEvent>,
    x: number,
    y: number
  ) => {
    if (!isDrawingRef.current) return;
    if (activeElement && "startX" in activeElement) {
      if (e.evt.shiftKey) {
        const min = Math.min(
          Math.abs(activeElement.startX - x),
          Math.abs(activeElement.startY - y)
        );

        setActiveElement({
          ...activeElement,
          x: Math.min(
            activeElement.startX,
            Math.max(x, activeElement.startX - min)
          ),
          y: Math.min(
            activeElement.startY,
            Math.max(y, activeElement.startY - min)
          ),
          width: min,
          height: min
        });
        return;
      }

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
