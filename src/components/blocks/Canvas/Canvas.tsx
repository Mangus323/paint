import React, { JSX, useEffect, useRef } from "react";
import { ActiveElementEdit } from "@/components/blocks/Canvas/ActiveElementEdit/ActiveElementEdit";
import { Scrollbar } from "@/components/blocks/Canvas/Scrollbar/Scrollbar";
import { StatusBar } from "@/components/blocks/Canvas/StatusBar/StatusBar";
import { CanvasImage } from "@/components/elements/Canvas/CanvasImage/CanvasImage";
import { CustomEllipse } from "@/components/elements/Canvas/Ellipse/Ellipse";
import { useCopySelection } from "@/hooks/ref/useCopySelection";
import { useDownloadingImage } from "@/hooks/ref/useDownloadingImage";
import { useMouseHandlers } from "@/hooks/useMouseHandlers";
import { edit, startDraw } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { changeMeta } from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Konva from "konva";
import {
  Group,
  Layer,
  Line,
  Rect,
  Stage,
  Text,
  Transformer
} from "react-konva";
import s from "./index.module.scss";

const MemoImage = React.memo(CanvasImage);
const MemoStatusBar = React.memo(StatusBar);
const MemoScrollbar = React.memo(Scrollbar);

export const Canvas = (): JSX.Element => {
  const {
    canvasHeight,
    canvasWidth,
    zoom,
    layerWidth,
    layerHeight,
    layerX,
    layerY
  } = useAppSelector(state => state.browser);
  const { elements, isDrawing } = useAppSelector(state => state.canvas);
  const dispatch = useAppDispatch();
  const lastElementRef = useRef<any>(null);
  const transformerRef = React.useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleClick,
    handleWheel
  } = useMouseHandlers();
  useDownloadingImage(stageRef);
  useCopySelection(stageRef);
  const { activeElement, isActiveElement } = useActiveElement();

  const onTransformStart = () => {
    dispatch(startDraw());
  };

  const onTransformEnd = () => {
    const node = lastElementRef.current;
    const { x, y } = node.scale();
    dispatch(
      edit({
        scaleX: x,
        scaleY: y
      })
    );
  };

  useEffect(() => {
    if (!(lastElementRef.current && !isDrawing && isActiveElement)) return;
    const meta = lastElementRef.current.getClientRect();
    if (meta) dispatch(changeMeta(meta));
  }, [isDrawing, activeElement, isActiveElement, zoom]);

  useEffect(() => {
    if (!isActiveElement || !transformerRef.current || !lastElementRef.current)
      return;
    transformerRef.current.nodes([lastElementRef.current]);
    transformerRef.current.getLayer()?.batchDraw();
  }, [activeElement, isActiveElement]);

  return (
    <section className={s.container}>
      <Stage
        width={canvasWidth}
        height={canvasHeight}
        onWheel={handleWheel}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        ref={stageRef}>
        <Layer>
          {/* Background */}
          <Rect
            x={0}
            y={0}
            width={canvasWidth}
            height={canvasHeight}
            fill={"#eeeeee"}
          />
        </Layer>
        <Layer x={layerX} y={layerY}>
          <Group
            width={layerWidth}
            height={layerHeight}
            clipX={0}
            clipY={0}
            clipWidth={layerWidth}
            clipHeight={layerHeight}
            scaleY={zoom}
            scaleX={zoom}
            onClick={handleClick}
            onMouseDown={handleMouseDown}>
            <Rect
              x={0}
              y={0}
              width={layerWidth}
              height={layerHeight}
              fill={"#ffffff"}
            />
            {elements.map((element, index, array) => {
              const { tool, ...elementProps } = element;
              const isLast = index === array.length - 1;
              const props = {
                ref: isLast ? lastElementRef : undefined,
                onTransformEnd: isLast ? onTransformEnd : undefined,
                onTransformStart: isLast ? onTransformStart : undefined,
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
                case "line":
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
            {isActiveElement && (
              <Transformer
                ref={transformerRef}
                onMouseDown={e => {
                  e.cancelBubble = true;
                }}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 2 || newBox.height < 2) return oldBox;
                  return newBox;
                }}
                rotateEnabled={false}
                borderStroke={"#070d14"}
                borderStrokeWidth={isDrawing ? 0 : 2}
                anchorCornerRadius={1}
                anchorSize={isDrawing ? 0 : 8}
                anchorStrokeWidth={1}
                anchorStroke={"#c4dfdf"}
              />
            )}
          </Group>
        </Layer>
        <MemoScrollbar />
      </Stage>
      <ActiveElementEdit />
      <MemoStatusBar />
    </section>
  );
};
