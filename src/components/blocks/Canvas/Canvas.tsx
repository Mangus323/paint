import React, { JSX } from "react";
import { place } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Circle, Layer, Line, Rect, Stage, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";

import Vector2d = Konva.Vector2d;

export const Canvas = (): JSX.Element => {
  const { canvasHeight, canvasWidth } = useSelector(
    (state: RootState) => state.browser
  );
  const {
    selectedTool: tool,
    elements,
    selectedColor: color
  } = useSelector((state: RootState) => state.canvas);
  const dispatch: AppDispatch = useDispatch();
  const [lines, setLines] = React.useState<any[]>([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "pen" || tool === "eraser") {
      isDrawing.current = true;
      const { x, y } = getPoints(e);
      setLines([...lines, { points: [x, y] }]);
    }
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current) {
      return;
    }
    let { x, y } = getPoints(e);
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([x, y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  console.log(lines);

  const handleMouseUp = (e: KonvaEventObject<MouseEvent>) => {
    isDrawing.current = false;
    if (tool === "pen" || tool === "eraser") {
      for (let i = 0; i < lines.length; i++) {
        dispatch(
          place({
            points: lines[i].points,
            tool: tool
          })
        );
      }
      setLines([]);
    }
  };

  const onClick = (e: KonvaEventObject<MouseEvent>) => {
    let { x, y } = getPoints(e);
    // dispatch(place({ width: 100, height: 100, x, y }));
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
                return <Rect {...element} key={index} />;
              case "circle":
                return <Circle {...element} key={index} />;
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
                    globalCompositeOperation={"destination-out"}
                  />
                );
              case "text":
                return <Text {...element} key={index} />;
            }
          })}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={color}
              strokeWidth={5}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
              globalCompositeOperation={
                tool === "eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>
    </>
  );
};

function getPoints(e: KonvaEventObject<MouseEvent | TouchEvent>): Vector2d {
  const stage = e.target.getStage();
  if (stage) {
    let point = stage.getPointerPosition();
    const x = point?.x || -1;
    const y = point?.y || -1;
    return { x, y };
  }
  return { x: -1, y: -1 };
}
