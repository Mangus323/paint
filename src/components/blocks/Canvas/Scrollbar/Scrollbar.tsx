import React, { JSX } from "react";
import { sp } from "@/globals/globals";
import { set } from "@/redux/slices/browser/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Layer, Rect } from "react-konva";

const styleProps = {
  width: 100,
  height: 10,
  fill: "gray",
  opacity: 0.8
};

export const Scrollbar = (): JSX.Element => {
  const { verticalBar, horizontalBar } = useAppSelector(state => state.browser);
  const { canvasHeight, canvasWidth, zoom, layerWidth, layerHeight } =
    useAppSelector(state => state.browser);
  const dispatch = useAppDispatch();

  const innerHeight = layerHeight * zoom;
  const innerWidth = layerWidth * zoom;

  return (
    <Layer>
      {/* Vertical */}
      {innerHeight > canvasHeight && (
        <Rect
          {...styleProps}
          width={styleProps.height}
          height={styleProps.width}
          x={verticalBar.x}
          y={verticalBar.y}
          draggable={true}
          dragBoundFunc={pos => {
            pos.x = canvasWidth - styleProps.height - sp;
            pos.y = Math.max(
              Math.min(pos.y, canvasHeight - styleProps.width - sp),
              sp
            );
            dispatch(
              set({
                verticalBar: {
                  x: pos.x,
                  y: pos.y
                }
              })
            );
            return pos;
          }}
          onDragMove={() => {
            if (innerHeight <= canvasHeight) return;
            const availableHeight = canvasHeight - sp * 2 - styleProps.width;
            const delta = (verticalBar.y - sp) / availableHeight;
            dispatch(
              set({
                layerY: (canvasHeight - innerHeight) * delta
              })
            );
          }}
        />
      )}
      {/* Horizontal */}
      {innerWidth > canvasWidth && (
        <Rect
          {...styleProps}
          x={horizontalBar.x}
          y={horizontalBar.y}
          draggable={true}
          dragBoundFunc={pos => {
            pos.y = canvasHeight - styleProps.height - sp;
            pos.x = Math.max(
              Math.min(pos.x, canvasWidth - styleProps.width - sp),
              sp
            );
            dispatch(
              set({
                horizontalBar: {
                  x: pos.x,
                  y: pos.y
                }
              })
            );
            return pos;
          }}
          onDragMove={() => {
            if (innerWidth <= canvasWidth) return;
            const availableWidth = canvasWidth - sp * 2 - styleProps.width;
            const delta = (horizontalBar.x - sp) / availableWidth;
            dispatch(
              set({
                layerX: -(innerWidth - canvasWidth) * delta
              })
            );
          }}
        />
      )}
    </Layer>
  );
};
