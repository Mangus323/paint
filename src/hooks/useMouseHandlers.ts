import { useFigure } from "@/hooks/useFigure";
import { usePen } from "@/hooks/usePen";
import { useText } from "@/hooks/useText";
import { place } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { useAppDispatch } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;

export const useMouseHandlers = () => {
  const dispatch = useAppDispatch();
  const { isActiveElement } = useActiveElement();
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
    if (isActiveElement) {
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
