import React, { JSX } from "react";
import { place } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { KonvaEventObject } from "konva/lib/Node";
import { Circle, Layer, Line, Rect, Stage, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";

export const Canvas = (): JSX.Element => {
  const { canvasHeight, canvasWidth } = useSelector(
    (state: RootState) => state.browser
  );
  const { elements } = useSelector((state: RootState) => state.canvas);
  const dispatch: AppDispatch = useDispatch();

  const [tool, setTool] = React.useState("pen");
  const [lines, setLines] = React.useState([]);
  const isDrawing = React.useRef(false);

  const handleMouseDown = e => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([...lines, { tool, points: [pos.x, pos.y] }]);
  };

  const handleMouseMove = e => {
    // no drawing - skipping
    if (!isDrawing.current) {
      return;
    }
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // replace last
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // console.log(elements);

  const onClick = (e: KonvaEventObject<MouseEvent>) => {
    const x = e.evt.offsetX;
    const y = e.evt.offsetY;
    dispatch(place({ width: 100, height: 100, x, y }));
  };

  // console.log(lines);

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
        </Layer>
      </Stage>
    </>
  );
};
