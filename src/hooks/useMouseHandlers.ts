import { useFigure } from "@/hooks/useFigure";
import { usePen } from "@/hooks/usePen";
import { useText } from "@/hooks/useText";
import { place } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";

import KonvaEventObject = Konva.KonvaEventObject;

export const useMouseHandlers = () => {
  const dispatch: AppDispatch = useDispatch();
  const { activeElement } = useSelector((state: RootState) => state.canvas);
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

  const placePrevious = () => {
    if (activeElement) {
      dispatch(place());
      return;
    }
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    placePrevious();
    penDown(e);
    figureDown(e);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    let { x, y } = getPoints(e);
    penMove(x, y);
    figureMove(x, y);
  };

  const handleMouseUp = () => {
    penUp();
    figureUp();
  };

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    handleTextClick(e);
  };

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClick
  };
};
