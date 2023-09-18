import React, { JSX, forwardRef } from "react";
import { ILine } from "@/types/canvas";
import Konva from "konva";
import { Circle, Group, Line, RegularPolygon } from "react-konva";

import LineConfig = Konva.LineConfig;

interface CustomLineProps extends LineConfig {
  arrowType: ILine["arrowType"];
  points: number[];
  strokeWidth: number;
  stroke: string;
  x: number;
  y: number;
  onTransformStart: () => void;
}

export const CustomLine = forwardRef<any, CustomLineProps>(
  (props: CustomLineProps, ref): JSX.Element => {
    const {
      rotation,
      arrowType,
      offsetX,
      offsetY,
      x,
      y,
      onTransformStart,
      ...lineProps
    } = props;
    const points = props.points;
    const lastPoint = [points[2], points[3]];
    let angle = points.length === 4 ? TwoPointsToDegree(points) : 0;

    return (
      <Group
        ref={ref}
        rotation={rotation}
        offsetX={offsetX}
        offsetY={offsetY}
        x={x}
        y={y}
        onTransformStart={onTransformStart}>
        {!isNaN(lastPoint[0]) && arrowType === "circle" && (
          <Circle
            fill={props.stroke}
            radius={props.strokeWidth + 4}
            x={lastPoint[0]}
            y={lastPoint[1]}
          />
        )}
        {!isNaN(lastPoint[0]) && arrowType === "triangle" && (
          <RegularPolygon
            rotation={angle}
            sides={3}
            fill={props.stroke}
            radius={props.strokeWidth + 4}
            x={lastPoint[0]}
            y={lastPoint[1]}
          />
        )}
        {!isNaN(lastPoint[0]) && arrowType === "line" && (
          <>
            <Line
              rotation={(angle + 330) % 360}
              stroke={props.stroke}
              strokeWidth={props.strokeWidth}
              points={[0, 0, 0, props.strokeWidth * 3]}
              x={lastPoint[0]}
              y={lastPoint[1]}
              lineCap={"round"}
              lineJoin={"round"}
              globalCompositeOperation={"source-over"}
            />
            <Line
              rotation={(angle + 30) % 360}
              stroke={props.stroke}
              strokeWidth={props.strokeWidth}
              points={[0, 0, 0, props.strokeWidth * 3]}
              x={lastPoint[0]}
              y={lastPoint[1]}
              lineCap={"round"}
              lineJoin={"round"}
              globalCompositeOperation={"source-over"}
            />
          </>
        )}

        <Line
          {...lineProps}
          lineCap={"round"}
          lineJoin={"round"}
          globalCompositeOperation={"source-over"}
        />
      </Group>
    );
  }
);

CustomLine.displayName = "CustomLine";

const TwoPointsToDegree = (points: number[]) => {
  let [x1, y1, x2, y2] = points;
  let result = (180 / Math.PI) * Math.atan2(y2 - y1, x2 - x1) + 90;

  return result < 0 ? result + 360 : result;
};
