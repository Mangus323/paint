"use client";

import React, { JSX, ReactNode, useContext, useEffect } from "react";
import { ScrollContext } from "@/components/HOC/ScrollProvider";
import { sidebarDimension as sd, sp } from "@/globals/globals";
import { useGlobalEventListener } from "@/hooks/useGlobalEventListener";
import { set } from "@/redux/slices/browser/reducer";
import { stopDraw } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";

interface WindowReaderProps {
  children: ReactNode;
}

export const WindowReader = (props: WindowReaderProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { setScroll, scroll } = useContext(ScrollContext);
  const { layerX, layerY } = scroll;
  const { canvasWidth, canvasHeight, layerWidth, layerHeight, zoom } =
    useAppSelector(state => state.browser);

  const onResize = ({
    canvasWidth,
    canvasHeight,
    layerX,
    layerY,
    layerWidth,
    layerHeight,
    zoom
  }) => {
    const difX = Math.max(0, window.innerWidth - canvasWidth - sd.width);
    const difY = Math.max(0, window.innerHeight - canvasHeight - sd.height);
    const localLayerX = Math.min(0, difX + layerX);
    const localLayerY = Math.min(0, difY + layerY);

    const innerWidth = layerWidth * zoom;
    const innerHeight = layerHeight * zoom;

    const availableHeight = canvasHeight - sp * 2 - 100;
    const vy =
      (localLayerY / (-innerHeight + canvasHeight)) * availableHeight + sp;

    const availableWidth = canvasWidth - sp * 2 - 100;
    const vx =
      (localLayerX / (-innerWidth + canvasWidth)) * availableWidth + sp;

    setScroll({
      layerX: localLayerX,
      layerY: localLayerY,
      horizontalBar: {
        x: vx,
        y: window.innerHeight - sd.height - sp - 10
      },
      verticalBar: {
        x: window.innerWidth - sd.width - sp - 10,
        y: vy
      }
    });
    dispatch(
      set({
        canvasWidth: window.innerWidth - sd.width,
        canvasHeight: window.innerHeight - sd.height
      })
    );
  };

  const onBlur = () => {
    dispatch(stopDraw());
  };

  useGlobalEventListener("window", "resize", onResize, {
    canvasWidth,
    canvasHeight,
    layerX,
    layerY,
    layerWidth,
    layerHeight,
    zoom
  });
  useGlobalEventListener("window", "blur", onBlur);

  useEffect(() => {
    setScroll({
      verticalBar: {
        x: window.innerWidth - sd.width - sp - 10,
        y: sp
      },
      horizontalBar: {
        x: sp,
        y: window.innerHeight - sd.height - sp - 10
      }
    });
    dispatch(
      set({
        layerWidth: window.innerWidth - sd.width,
        layerHeight: window.innerHeight - sd.height,
        canvasWidth: window.innerWidth - sd.width,
        canvasHeight: window.innerHeight - sd.height
      })
    );
  }, []);

  return <>{props.children}</>;
};
