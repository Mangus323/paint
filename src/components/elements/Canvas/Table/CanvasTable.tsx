import React, { JSX, forwardRef } from "react";
import Konva from "konva";
import { Group, Line, Rect } from "react-konva";

import RectConfig = Konva.RectConfig;

interface CanvasTableProps extends RectConfig {
  fillType: "outline" | "fill";
  columns: number;
  rows: number;
}

export const CanvasTable = forwardRef<any, CanvasTableProps>(
  (props: CanvasTableProps, ref): JSX.Element => {
    const {
      rotation,
      offsetX,
      offsetY,
      x,
      y,
      onTransformStart,
      fillType,
      width,
      height,
      rows,
      columns,
      ...tableProps
    } = props;
    if (!width || !height) return <></>;
    const columnsArray = new Array(columns - 1).fill(0);
    const rowsArray = new Array(rows - 1).fill(0);

    return (
      <Group
        ref={ref}
        rotation={rotation}
        offsetX={offsetX}
        offsetY={offsetY}
        x={x}
        y={y}
        onTransformStart={onTransformStart}>
        {columnsArray.map((_, i) => {
          const x = ((i + 1) / columns) * width;
          return (
            <Line
              key={i}
              {...tableProps}
              points={[x, 0, x, height]}
              lineCap={"round"}
              lineJoin={"round"}
              globalCompositeOperation={"source-over"}
            />
          );
        })}
        {rowsArray.map((_, i) => {
          const y = ((i + 1) / rows) * height;
          return (
            <Line
              key={i}
              {...tableProps}
              points={[0, y, width, y]}
              lineCap={"round"}
              lineJoin={"round"}
              globalCompositeOperation={"source-over"}
            />
          );
        })}
        {fillType === "fill" && (
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            {...tableProps}
            fillEnabled={false}
          />
        )}
      </Group>
    );
  }
);

CanvasTable.displayName = "CustomTable";
