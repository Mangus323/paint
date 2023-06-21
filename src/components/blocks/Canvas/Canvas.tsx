import React, { JSX } from "react";
import { ActiveElement } from "@/components/blocks/Canvas/ActiveElement/ActiveElement";
import { useFigure } from "@/hooks/useFigure";
import { usePen } from "@/hooks/usePen";
import { RootState } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";
import { Ellipse, Layer, Line, Rect, Stage, Text } from "react-konva";
import { useSelector } from "react-redux";

import KonvaEventObject = Konva.KonvaEventObject;

export const Canvas = (): JSX.Element => {
  const { canvasHeight, canvasWidth } = useSelector(
    (state: RootState) => state.browser
  );
  const { elements, selectedColor: color } = useSelector(
    (state: RootState) => state.canvas
  );
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

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    penDown(e);
    figureDown(e);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    penMove(e);
    figureMove(e);
  };

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    penUp();
    figureUp();
  };

  const onClick = (e: KonvaEventObject<MouseEvent>) => {
    let { x, y } = getPoints(e);
  };

  return (
    <>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}>
        <Layer>
          <Text text="Try click on rect" x={500} y={100} />
          {elements.map((element, index) => {
            switch (element.tool) {
              case "rect":
                return <Rect {...element} fill={color} key={index} />;
              case "ellipse":
                return <Ellipse {...element} key={index} />;
              case "pen":
                return (
                  <Line
                    {...element}
                    key={index}
                    globalCompositeOperation={"source-over"}
                    stroke={element.color}
                    strokeWidth={5}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              case "eraser":
                return (
                  <Line
                    {...element}
                    key={index}
                    stroke={"#ffffff"}
                    globalCompositeOperation={"destination-out"}
                  />
                );
              case "text":
                return <Text {...element} key={index} />;
            }
          })}
          <ActiveElement lines={lines} figure={figure} />
        </Layer>
      </Stage>
    </>
  );
};
