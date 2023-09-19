import { sp } from "@/globals/globals";
import { useFigure } from "@/hooks/useFigure";
import { usePen } from "@/hooks/usePen";
import { useSelection } from "@/hooks/useSelection";
import { useText } from "@/hooks/useText";
import { set } from "@/redux/slices/browser/reducer";
import { stopDraw } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;

export const useMouseHandlers = () => {
  const dispatch = useAppDispatch();
  const {
    canvasHeight,
    canvasWidth,
    zoom,
    layerWidth,
    layerHeight,
    verticalBar,
    horizontalBar,
    layerY,
    layerX
  } = useAppSelector(state => state.browser);
  const { isDrawing } = useAppSelector(state => state.canvas);

  useSelection();
  const {
    handleMouseUp: penUp,
    handleMouseDown: penDown,
    handleMouseMove: penMove
  } = usePen();
  const {
    handleMouseDown: figureDown,
    handleMouseMove: figureMove,
    handleMouseUp: figureUp
  } = useFigure();
  const { handleClick: handleTextClick } = useText();

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    // Left mouse button
    if (e.evt.button !== 0) return;
    penDown(e);
    figureDown(e);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    let { x, y } = getPoints(e, zoom, { x: layerX, y: layerY });
    penMove(x, y);
    figureMove(x, y);
  };

  const handleMouseUp = () => {
    penUp();
    figureUp();
    if (isDrawing) {
      dispatch(stopDraw());
    }
  };

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    handleTextClick(e);
  };

  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    if (e.evt.ctrlKey) return;
    e.evt.preventDefault();
    let dy = 0;
    let dx = 0;
    if (e.evt.shiftKey) dx = e.evt.deltaX || e.evt.deltaY;
    else dy = e.evt.deltaY;
    const innerWidth = layerWidth * zoom;
    const innerHeight = layerHeight * zoom;
    if (dy && innerHeight <= canvasHeight) return;
    if (dx && innerWidth <= canvasWidth) return;
    if (dy) {
      const minY = -(innerHeight - canvasHeight);
      const localLayerY = Math.max(minY, Math.min(layerY - dy, 0));
      const availableHeight = canvasHeight - sp * 2 - 100;
      const vy =
        (localLayerY / (-innerHeight + canvasHeight)) * availableHeight + sp;
      dispatch(
        set({
          layerY: localLayerY,
          verticalBar: {
            x: verticalBar.x,
            y: vy
          }
        })
      );
    }
    if (dx) {
      const minX = -(innerWidth - canvasWidth);
      const localLayerX = Math.max(minX, Math.min(layerX - dx, 0));
      const availableWidth = canvasWidth - sp * 2 - 100;
      const vx =
        (localLayerX / (-innerWidth + canvasWidth)) * availableWidth + sp;
      dispatch(
        set({
          layerX: localLayerX,
          horizontalBar: {
            x: vx,
            y: horizontalBar.y
          }
        })
      );
    }
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClick,
    handleWheel
  };
};
