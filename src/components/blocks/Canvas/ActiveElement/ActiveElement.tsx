import React, { JSX } from "react";
import { RootState } from "@/redux/store";
import { IFigure, IText } from "@/types/canvas";
import { Ellipse, Line, Rect, Text } from "react-konva";
import { useSelector } from "react-redux";

interface IActiveElementProps {
  lines: number[];
  figure: Omit<IFigure, "tool">;
  textShape: Omit<IText, "tool">;
}

export const ActiveElement = (props: IActiveElementProps): JSX.Element => {
  const { lines, figure, textShape } = props;
  const { selectedTool: tool, selectedColor: color } = useSelector(
    (state: RootState) => state.canvas
  );

  console.log(textShape);

  if (tool === "text") {
    return <Text {...textShape} color={color} />;
  }
  if (tool === "ellipse") {
    return (
      <Ellipse
        x={(figure.x + figure.width + figure.x) / 2}
        y={(figure.y + figure.height + figure.y) / 2}
        radiusX={Math.abs(figure.width / 2)}
        radiusY={Math.abs(figure.height / 2)}
        fill={color}
      />
    );
  }
  if (tool === "rect") {
    return <Rect {...figure} fill={color} />;
  }
  if (lines.length && (tool === "eraser" || tool === "pen"))
    return (
      <Line
        points={lines}
        stroke={color}
        strokeWidth={5}
        tension={0.5}
        lineCap="round"
        lineJoin="round"
        globalCompositeOperation={
          tool === "eraser" ? "destination-out" : "source-over"
        }
      />
    );

  return <></>;
};
