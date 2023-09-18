"use client";

import React, { JSX, useCallback, useEffect, useRef } from "react";
import { ActiveElementEdit } from "@/components/blocks/Canvas/ActiveElementEdit/ActiveElementEdit";
import { Scrollbar } from "@/components/blocks/Canvas/Scrollbar/Scrollbar";
import { StatusBar } from "@/components/blocks/Canvas/StatusBar/StatusBar";
import { CanvasImage } from "@/components/elements/Canvas/Image/CanvasImage";
import { CustomLine } from "@/components/elements/Canvas/Line/CanvasLine";
import { useCopySelection } from "@/hooks/ref/useCopySelection";
import { useDownloadingImage } from "@/hooks/ref/useDownloadingImage";
import { useMouseHandlers } from "@/hooks/useMouseHandlers";
import { edit, startDraw } from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { changeMeta } from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IElement } from "@/types/canvas";
import { getCanvasElementProps } from "@/utils/getCanvasElementProps";
import Konva from "konva";
import {
  Ellipse,
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

  const onTransformStart = useCallback(() => dispatch(startDraw()), []);

  const onTransformEnd = useCallback(() => {
    const current = lastElementRef.current;
    const tool = current.attrs.tool;
    const { x: scaleX, y: scaleY } = current.scale();
    const { x, y } = current.position();
    let editObj: Partial<IElement>;

    if (tool === "ellipse")
      editObj = {
        x: x - current.attrs.radiusX,
        y: y - current.attrs.radiusY,
        scaleX,
        scaleY
      };
    else if (tool === "pen" || tool === "eraser" || tool === "line")
      editObj = {
        x: x,
        y: y,
        scaleX,
        scaleY
      };
    else
      editObj = {
        x: x - current.offsetX(),
        y: y - current.offsetY(),
        scaleX,
        scaleY
      };

    if (Object.keys(editObj).length) dispatch(edit(editObj));
  }, []);

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

  // TODO decide how to transform text
  // useEffect(() => {
  //   if (
  //     isActiveElement &&
  //     activeElement.tool === "text" &&
  //     lastElementRef.current
  //   ) {
  //     const current = lastElementRef.current;
  //     dispatch(
  //       edit({
  //         offsetX: current.width() / 2,
  //         offsetY: current.height() / 2,
  //         x: current.attrs.x,
  //         y: current.attrs.y
  //       })
  //     );
  //   }
  // }, [(activeElement as IText)?.text]);

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
              const isLast = index === array.length - 1;
              const props = {
                ref: isLast ? lastElementRef : undefined,
                onTransformEnd: isLast ? onTransformEnd : undefined,
                onTransformStart: isLast ? onTransformStart : undefined,
                ...element,
                ...getCanvasElementProps(element)
              };

              switch (element.tool) {
                case "rect":
                  return <Rect key={index} {...props} />;
                case "ellipse":
                  // @ts-ignore
                  return <Ellipse key={index} {...props} />;
                case "pen":
                case "eraser":
                  return <Line key={index} {...props} />;
                case "line":
                  return <CustomLine key={index} {...props} />;
                case "text":
                  return <Text key={index} {...props} />;
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
                borderStroke={"#070d1480"}
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
