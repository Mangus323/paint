import React, { JSX } from "react";
import { RootState } from "@/redux/store";
import { IFigure } from "@/types/canvas";
import { Ellipse, Line, Rect } from "react-konva";
import { useSelector } from "react-redux";

interface IActiveElementProps {
  lines: number[];
  figure: Omit<IFigure, "tool">;
}

export const ActiveElement = (props: IActiveElementProps): JSX.Element => {
  const { lines, figure } = props;
  const { selectedTool: tool, selectedColor: color } = useSelector(
    (state: RootState) => state.canvas
  );

  if (tool === "ellipse") {
    return <Ellipse {...figure} fill={color} />;
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
