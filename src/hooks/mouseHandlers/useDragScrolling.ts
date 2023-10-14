import { useContext, useEffect, useRef, useState } from "react";
import { MousePositionContext } from "@/components/HOC/MouseListener";
import { ScrollContext } from "@/components/HOC/ScrollProvider";
import { sp } from "@/globals/globals";
import { useAppSelector } from "@/redux/store";
import Konva from "konva";

import Vector2d = Konva.Vector2d;

export const useDragScrolling = () => {
  const { isDrawing } = useAppSelector(state => state.canvas);
  const { canvasHeight, canvasWidth, zoom, layerWidth, layerHeight } =
    useAppSelector(state => state.browser);
  const isDrawingRef = useRef(false);
  const { x, y } = useContext(MousePositionContext);
  const { setScroll, scroll } = useContext(ScrollContext);
  const { layerX, layerY, horizontalBar, verticalBar } = scroll;
  const [startPoint, setStartPoint] = useState<{
    cursor: Vector2d;
    layer: Vector2d;
  } | null>(null);

  const handleMouseDown = () => {
    setStartPoint({ cursor: { x, y }, layer: { x: layerX, y: layerY } });
  };

  const handleMouseMove = () => {
    if (!startPoint) return;
    const dx = startPoint.cursor.x - x;
    const dy = startPoint.cursor.y - y;

    const innerWidth = layerWidth * zoom;
    const innerHeight = layerHeight * zoom;
    if (innerHeight <= canvasHeight && innerWidth <= canvasWidth) return;

    const minY = -(innerHeight - canvasHeight);
    const localLayerY =
      innerHeight <= canvasHeight
        ? 0
        : Math.max(minY, Math.min(startPoint.layer.y - dy, 0));
    const availableHeight = canvasHeight - sp * 2 - 100;
    const vy =
      (localLayerY / (-innerHeight + canvasHeight)) * availableHeight + sp;

    const minX = -(innerWidth - canvasWidth);
    const localLayerX =
      innerWidth <= canvasWidth
        ? 0
        : Math.max(minX, Math.min(startPoint.layer.x - dx, 0));
    const availableWidth = canvasWidth - sp * 2 - 100;
    const vx =
      (localLayerX / (-innerWidth + canvasWidth)) * availableWidth + sp;

    setScroll({
      layerX: localLayerX,
      layerY: localLayerY,
      horizontalBar: {
        x: vx,
        y: horizontalBar.y
      },
      verticalBar: {
        x: verticalBar.x,
        y: vy
      }
    });
  };

  const handleMouseUp = () => {
    setStartPoint(null);
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
