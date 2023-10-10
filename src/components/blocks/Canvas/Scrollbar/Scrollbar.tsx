import React, { JSX, useContext, useEffect, useState } from "react";
import { ScrollContext } from "@/components/HOC/ScrollProvider";
import { sp } from "@/globals/globals";
import { useAppSelector } from "@/redux/store";
import { Layer, Rect } from "react-konva";

const styleProps = {
  width: 100,
  height: 10,
  fill: "gray",
  opacity: 0.8
};

export const Scrollbar = (): JSX.Element => {
  const { scroll, setScroll } = useContext(ScrollContext);
  const { verticalBar, horizontalBar } = scroll;
  const { canvasHeight, canvasWidth, zoom, layerWidth, layerHeight } =
    useAppSelector(state => state.browser);
  const [isDraggingHorizontal, setIsDraggingHorizontal] = useState(false);
  const [isDraggingVertical, setIsDraggingVertical] = useState(false);

  const [currentHorizontalBar, setCurrentHorizontalBar] =
    useState(horizontalBar);
  const [currentVerticalBar, setCurrentVerticalBar] = useState(verticalBar);

  const innerHeight = layerHeight * zoom;
  const innerWidth = layerWidth * zoom;

  useEffect(() => {
    if (!isDraggingHorizontal) setCurrentHorizontalBar(horizontalBar);
  }, [horizontalBar, isDraggingHorizontal]);

  useEffect(() => {
    if (!isDraggingVertical) setCurrentVerticalBar(verticalBar);
  }, [verticalBar, isDraggingVertical]);

  return (
    <Layer>
      {/* Vertical */}
      {innerHeight > canvasHeight && (
        <Rect
          {...styleProps}
          width={styleProps.height}
          height={styleProps.width}
          x={currentVerticalBar.x}
          y={currentVerticalBar.y}
          onDragStart={() => {
            setIsDraggingVertical(true);
          }}
          onDragEnd={() => {
            setIsDraggingVertical(false);
          }}
          draggable={true}
          dragBoundFunc={pos => {
            pos.x = canvasWidth - styleProps.height - sp;
            pos.y = Math.max(
              Math.min(pos.y, canvasHeight - styleProps.width - sp),
              sp
            );
            setScroll({
              verticalBar: {
                x: pos.x,
                y: pos.y
              }
            });

            return pos;
          }}
          onDragMove={e => {
            if (innerHeight <= canvasHeight) return;

            const availableHeight = canvasHeight - sp * 2 - styleProps.width;
            const delta = (e.target.y() - sp) / availableHeight;
            setScroll({
              layerY: (canvasHeight - innerHeight) * delta
            });
          }}
        />
      )}
      {/* Horizontal */}
      {innerWidth > canvasWidth && (
        <Rect
          width={100}
          height={10}
          fill={"gray"}
          opacity={0.8}
          x={currentHorizontalBar.x}
          y={currentHorizontalBar.y}
          onDragStart={() => {
            setIsDraggingHorizontal(true);
          }}
          onDragEnd={() => {
            setIsDraggingHorizontal(false);
          }}
          draggable={true}
          dragBoundFunc={pos => {
            pos.y = canvasHeight - styleProps.height - sp;
            pos.x = Math.max(
              Math.min(pos.x, canvasWidth - styleProps.width - sp),
              sp
            );

            setScroll({
              horizontalBar: {
                x: pos.x,
                y: pos.y
              }
            });

            return pos;
          }}
          onDragMove={e => {
            if (innerWidth <= canvasWidth) return;
            const availableWidth = canvasWidth - sp * 2 - styleProps.width;
            const delta = (e.target.x() - sp) / availableWidth;

            setScroll({
              layerX: -(innerWidth - canvasWidth) * delta
            });
          }}
        />
      )}
    </Layer>
  );
};
