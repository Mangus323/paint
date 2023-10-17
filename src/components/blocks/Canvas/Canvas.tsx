"use client";

import React, {
  JSX,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef
} from "react";
import { ScrollContext } from "@/components/HOC/ScrollProvider";
import { ActiveElementEdit } from "@/components/blocks/Canvas/ActiveElementEdit/ActiveElementEdit";
import { Scrollbar } from "@/components/blocks/Canvas/Scrollbar/Scrollbar";
import { StatusBar } from "@/components/blocks/Canvas/StatusBar/StatusBar";
import { CanvasImage } from "@/components/elements/Canvas/Image/CanvasImage";
import { CustomLine } from "@/components/elements/Canvas/Line/CanvasLine";
import { useMouseHandlers } from "@/hooks/mouseHandlers/useMouseHandlers";
import { useCopySelection } from "@/hooks/ref/useCopySelection";
import { useDownloadingImage } from "@/hooks/ref/useDownloadingImage";
import { useActiveElement } from "@/hooks/useActiveElement";
import { startDraw } from "@/redux/slices/canvas/reducer";
import { changeMeta } from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IElement } from "@/types/canvas";
import { getCanvasElementProps } from "@/utils/getCanvasElementProps";
import { Box } from "@mui/material";
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

const MemoImage = React.memo(CanvasImage);
const MemoStatusBar = React.memo(StatusBar);
const MemoScrollbar = React.memo(Scrollbar);

const CanvasComponent = (): JSX.Element => {
  const { canvasHeight, canvasWidth, zoom, layerWidth, layerHeight } =
    useAppSelector(state => state.browser);
  const { elements, isDrawing } = useAppSelector(state => state.canvas);
  const { layerY, layerX } = useContext(ScrollContext).scroll;
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
  const { setActiveElement, activeElement } = useActiveElement();

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
    else if (
      tool === "pen" ||
      tool === "eraser" ||
      tool === "line" ||
      tool === "image"
    )
      editObj = {};
    else
      editObj = {
        x: x - current.offsetX(),
        y: y - current.offsetY(),
        scaleX,
        scaleY
      };

    if (Object.keys(editObj).length)
      setActiveElement({
        ...activeElement,
        ...editObj
      } as any);
  }, [activeElement]);

  useEffect(() => {
    if (!lastElementRef.current || isDrawing || !activeElement) return;
    const meta = lastElementRef.current.getClientRect();
    if (meta) dispatch(changeMeta(meta));
  }, [isDrawing, activeElement, zoom, layerY, layerX]);

  useEffect(() => {
    if (!activeElement || !transformerRef.current || !lastElementRef.current)
      return;
    transformerRef.current.nodes([lastElementRef.current]);
  }, [activeElement]);

  return (
    <Box
      component={"section"}
      sx={{ position: "relative", overflow: "hidden" }}>
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
            {[...elements, activeElement].map((element, index, array) => {
              if (!element) return null;
              const isLast = activeElement
                ? index === array.length - 1
                : index === array.length - 2;
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
                case "polygon":
                  return <Line key={index} {...props} />;
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
            {activeElement && (
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
                padding={5}
              />
            )}
          </Group>
        </Layer>
        <MemoScrollbar />
      </Stage>
      <ActiveElementEdit />
      <MemoStatusBar />
    </Box>
  );
};

export const Canvas = memo(CanvasComponent);
