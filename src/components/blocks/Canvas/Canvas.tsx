import React, { JSX, useEffect, useRef } from "react";
import { ActiveElementEdit } from "@/components/blocks/Canvas/ActiveElementEdit/ActiveElementEdit";
import { CanvasImage } from "@/components/elements/Canvas/CanvasImage/CanvasImage";
import { CustomEllipse } from "@/components/elements/Canvas/Ellipse/Ellipse";
import { useDownloadingImage } from "@/hooks/useDownloadingImage";
import { useMouseHandlers } from "@/hooks/useMouseHandlers";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { changeMeta } from "@/redux/slices/editActiveElement/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Layer, Line, Rect, Stage, Text } from "react-konva";
import s from "./index.module.scss";

const MemoImage = React.memo(CanvasImage);
const MemoLine = React.memo(Line);

export const Canvas = (): JSX.Element => {
  const { canvasHeight, canvasWidth } = useAppSelector(state => state.browser);
  const {
    elements,
    isDrawing,
    selectedTool: tool
  } = useAppSelector(state => state.canvas);
  const dispatch = useAppDispatch();
  const { handleMouseDown, handleMouseMove, handleMouseUp, handleClick } =
    useMouseHandlers();
  const stageRef = useRef<any>(null);
  useDownloadingImage(stageRef);
  const lastElementRef = useRef<any>(null);
  const { activeElement, isActiveElement } = useActiveElement();

  useEffect(() => {
    if (lastElementRef.current && isDrawing === false && isActiveElement) {
      let width, height, x, y;
      const attrs = lastElementRef.current.attrs;
      switch (tool) {
        case "text":
          width = lastElementRef.current?.textWidth || 0;
          height = lastElementRef.current?.textHeight || 0;
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
  }, [isDrawing, activeElement, isActiveElement]);

  return (
    <section className={s.container}>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}>
        <Layer>
          {elements.map((element, index, array) => {
            const props = {
              ref: index === array.length - 1 ? lastElementRef : undefined,
              key: index,
              ...element
            };

            switch (element.tool) {
              case "rect":
                return <Rect fill={element.color} {...props} />;
              case "ellipse":
                // @ts-ignore
                return <CustomEllipse {...props} />;
              case "pen":
                return (
                  <MemoLine
                    {...props}
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
                    {...props}
                    stroke={"#ffffff"}
                    globalCompositeOperation={"destination-out"}
                  />
                );
              case "text":
                return <Text {...props} fill={element.color} />;
              case "image":
                return <MemoImage {...props} />;
            }
          })}
          {/*<ActiveElement />*/}
        </Layer>
      </Stage>
      <ActiveElementEdit />
    </section>
  );
};
