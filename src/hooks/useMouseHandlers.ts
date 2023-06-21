import { useFigure } from "@/hooks/useFigure";
import { usePen } from "@/hooks/usePen";
import { useText } from "@/hooks/useText";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;

export const useMouseHandlers = () => {
  const {
    handleMouseUp: penUp,
    handleMouseDown: penDown,
    handleMouseMove: penMove,
    lines
  } = usePen();
  const {
    handleMouseDown: figureDown,
    handleMouseMove: figureMove,
    handleMouseUp: figureUp,
    cords: figure
  } = useFigure();
  const { handleClick: handleTextClick, textShape } = useText();

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    penDown(e);
    figureDown(e);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    penMove(e);
    figureMove(e);
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
    handleClick,
    lines,
    figure,
    textShape
  };
};
