import React, { JSX, useEffect, useRef } from "react";
import { changeMeta } from "@/redux/slices/editActiveElement/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { IFigure, IText } from "@/types/canvas";
import { Ellipse, Line, Rect, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";

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
  const dispatch: AppDispatch = useDispatch();
  let ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current) {
      // console.log(ref.current);
      let width, height, x, y;

      switch (tool) {
        case "text":
          width = ref.current?.textWidth || 0;
          height = ref.current?.textHeight || 0;
          x = ref.current?.attrs.x;
          y = ref.current?.attrs.y;
      }
      dispatch(
        changeMeta({
          width,
          height,
          x,
          y
        })
      );
    }
  }, [lines, figure, textShape]);
  //
  // console.log(textShape);

  return (
    <>
      {tool === "text" && <Text {...textShape} fill={color} ref={ref} />}
      {tool === "ellipse" && (
        <Ellipse
          x={(figure.x + figure.width + figure.x) / 2}
          y={(figure.y + figure.height + figure.y) / 2}
          radiusX={Math.abs(figure.width / 2)}
          radiusY={Math.abs(figure.height / 2)}
          fill={color}
        />
      )}
      {tool === "rect" && <Rect {...figure} fill={color} />}
      {lines.length !== 0 && (tool === "eraser" || tool === "pen") && (
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
      )}
    </>
  );
};
