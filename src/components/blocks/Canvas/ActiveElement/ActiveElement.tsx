import React, { JSX, useEffect, useRef } from "react";
import { changeMeta } from "@/redux/slices/editActiveElement/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { Ellipse, Line, Rect, Text } from "react-konva";
import { useDispatch, useSelector } from "react-redux";

export const ActiveElement = (): JSX.Element => {
  const {
    selectedTool: tool,
    selectedColor: color,
    activeElement,
    isDrawing
  } = useSelector((state: RootState) => state.canvas);
  const dispatch: AppDispatch = useDispatch();
  let ref = useRef<any>(null);

  useEffect(() => {
    if (ref.current && isDrawing === false) {
      let width, height, x, y;
      const attrs = ref.current.attrs;
      switch (tool) {
        case "text":
          width = ref.current?.textWidth || 0;
          height = ref.current?.textHeight || 0;
          x = attrs.x;
          y = attrs.y;
          break;
        case "rect":
          width = Math.abs(attrs.width);
          height = Math.abs(attrs.height);
          x = attrs.width < 0 ? attrs.x + attrs.width : attrs.x;
          y = attrs.height < 0 ? attrs.y + attrs.height : attrs.y;
          break;
        case "ellipse":
          width = attrs.radiusX * 2;
          height = attrs.radiusY * 2;
          x = attrs.x - attrs.radiusX;
          y = attrs.y - attrs.radiusY;
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
  }, [isDrawing, activeElement]);

  if (!activeElement) return <></>;

  return (
    <>
      {tool === "text" && <Text {...activeElement} fill={color} ref={ref} />}
      {tool === "ellipse" && "width" in activeElement && (
        <Ellipse
          {...activeElement}
          x={(activeElement.x * 2 + activeElement.width) / 2}
          y={(activeElement.y * 2 + activeElement.height) / 2}
          radiusX={Math.abs(activeElement.width / 2)}
          radiusY={Math.abs(activeElement.height / 2)}
          fill={color}
          ref={ref}
        />
      )}
      {tool === "rect" && <Rect {...activeElement} fill={color} ref={ref} />}
      {"points" in activeElement &&
        activeElement.points.length !== 0 &&
        (tool === "eraser" || tool === "pen") && (
          <Line
            {...activeElement}
            stroke={color}
            strokeWidth={5}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation={
              tool === "eraser" ? "destination-out" : "source-over"
            }
            ref={ref}
          />
        )}
    </>
  );
};
