"use client";

import React, { JSX, useEffect, useRef } from "react";
import { ActiveElementEdit } from "@/components/blocks/Canvas/ActiveElementEdit/ActiveElementEdit";
import { Scrollbar } from "@/components/blocks/Canvas/Scrollbar/Scrollbar";
import { StatusBar } from "@/components/blocks/Canvas/StatusBar/StatusBar";
import { CustomEllipse } from "@/components/elements/Canvas/Ellipse/Ellipse";
import { CanvasImage } from "@/components/elements/Canvas/Image/CanvasImage";
import { CustomLine } from "@/components/elements/Canvas/Line/CanvasLine";
import { useCopySelection } from "@/hooks/ref/useCopySelection";
import { useDownloadingImage } from "@/hooks/ref/useDownloadingImage";
import { useMouseHandlers } from "@/hooks/useMouseHandlers";
import { edit, startDraw } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { changeMeta } from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IRect } from "@/types/canvas";
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
    const { x, y } = lastElementRef.current.scale();
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
  }, [isDrawing, activeElement, isActiveElement, zoom, layerY, layerX]);

  useEffect(() => {
    if (!isActiveElement || !transformerRef.current || !lastElementRef.current)
      return;
    transformerRef.current.nodes([lastElementRef.current]);
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
                ...elementProps
              };

              switch (element.tool) {
                case "rect":
                  return (
                    <Rect
                      key={index}
                      fill={element.color}
                      fillEnabled={element.fillType === "fill"}
                      stroke={element.color}
                      {...props}
                      cornerRadius={
                        Math.max(element.width, element.height) *
                        ((element as IRect).cornerRadius / 100)
                      }
                      dash={
                        element.dashEnabled && element.fillType === "outline"
                          ? [element.strokeWidth, element.strokeWidth * 2]
                          : undefined
                      }
                    />
                  );
                case "ellipse":
                  // @ts-ignore
                  return (
                    <CustomEllipse
                      key={index}
                      fill={element.color}
                      fillEnabled={element.fillType === "fill"}
                      stroke={element.color}
                      dash={
                        element.dashEnabled && element.fillType === "outline"
                          ? [element.strokeWidth, element.strokeWidth * 2]
                          : undefined
                      }
                      {...props}
                    />
                  );
                case "pen":
                  return (
                    <Line
                      key={index}
                      {...props}
                      globalCompositeOperation={"source-over"}
                      stroke={element.color}
                      lineCap="round"
                      lineJoin="round"
                      dash={
                        element.dashEnabled
                          ? [element.strokeWidth, element.strokeWidth * 2]
                          : undefined
                      }
                    />
                  );
                case "line":
                  return (
                    <CustomLine
                      key={index}
                      {...props}
                      stroke={element.color}
                      dash={
                        element.dashEnabled
                          ? [element.strokeWidth, element.strokeWidth * 2]
                          : undefined
                      }
                    />
                  );
                case "eraser":
                  return (
                    <Line
                      key={index}
                      {...props}
                      stroke={"#ffffff"}
                      lineCap="round"
                      lineJoin="round"
                      globalCompositeOperation={"destination-out"}
                    />
                  );
                case "text":
                  return <Text key={index} {...props} fill={element.color} />;
                case "image":
                  return <MemoImage key={index} {...props} />;
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
