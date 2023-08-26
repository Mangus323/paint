import React, { JSX, useEffect, useRef } from "react";
import { ActiveElementEdit } from "@/components/blocks/Canvas/ActiveElementEdit/ActiveElementEdit";
import { CanvasImage } from "@/components/elements/Canvas/CanvasImage/CanvasImage";
import { CustomEllipse } from "@/components/elements/Canvas/Ellipse/Ellipse";
import { useDownloadingImage } from "@/hooks/useDownloadingImage";
import { useMouseHandlers } from "@/hooks/useMouseHandlers";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { changeMeta } from "@/redux/slices/editActiveElement/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { calculateMeta } from "@/utils/calculateMeta";
import Konva from "konva";
import { Layer, Line, Rect, Stage, Text } from "react-konva";
import s from "./index.module.scss";

const MemoImage = React.memo(CanvasImage);

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
  const stageRef = useRef<Konva.Stage>(null);
  useDownloadingImage(stageRef);
  const lastElementRef = useRef<any>(null);
  const { activeElement, isActiveElement } = useActiveElement();

  useEffect(() => {
    if (!(lastElementRef.current && !isDrawing && isActiveElement)) return;
    const meta = calculateMeta(lastElementRef.current, tool);
    if (meta) dispatch(changeMeta(meta));
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
            const { tool, ...elementProps } = element;
            const props = {
              ref: index === array.length - 1 ? lastElementRef : undefined,
              key: index,
              ...elementProps
            };

            switch (element.tool) {
              case "rect":
                return <Rect fill={element.color} {...props} />;
              case "ellipse":
                // @ts-ignore
                return <CustomEllipse {...props} />;
              case "pen":
                return (
                  <Line
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
        </Layer>
      </Stage>
      <ActiveElementEdit />
    </section>
  );
};
