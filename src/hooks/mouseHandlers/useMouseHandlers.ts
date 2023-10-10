import { useContext } from "react";
import { ScrollContext } from "@/components/HOC/ScrollProvider";
import { sp } from "@/globals/globals";
import { useFigure } from "@/hooks/mouseHandlers/useFigure";
import { usePen } from "@/hooks/mouseHandlers/usePen";
import { useSelection } from "@/hooks/mouseHandlers/useSelection";
import { useText } from "@/hooks/mouseHandlers/useText";
import { stopDraw } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;

export const useMouseHandlers = () => {
  const dispatch = useAppDispatch();
  const { setScroll, scroll } = useContext(ScrollContext);
  const { layerX, layerY, horizontalBar, verticalBar } = scroll;
  const { canvasHeight, canvasWidth, zoom, layerWidth, layerHeight } =
    useAppSelector(state => state.browser);
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
    penMove(e, x, y);
    figureMove(e, x, y);
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

      setScroll({
        layerY: localLayerY,
        verticalBar: {
          x: verticalBar.x,
          y: vy
        }
      });
    }
    if (dx) {
      const minX = -(innerWidth - canvasWidth);
      const localLayerX = Math.max(minX, Math.min(layerX - dx, 0));
      const availableWidth = canvasWidth - sp * 2 - 100;
      const vx =
        (localLayerX / (-innerWidth + canvasWidth)) * availableWidth + sp;

      setScroll({
        layerX: localLayerX,
        horizontalBar: {
          x: vx,
          y: horizontalBar.y
        }
      });
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
