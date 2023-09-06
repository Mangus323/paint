import React, { useEffect } from "react";
import { sidebarDimension as sd } from "@/globals/globals";
import { setIsCopying } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Konva from "konva";

import Stage = Konva.Stage;

const copyImage = (imageData: ImageData, width: number, height: number) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  ctx?.putImageData(imageData, 0, 0);
  return canvas.toBlob(blob => {
    if (!blob) return;
    const item = new ClipboardItem({ "image/png": blob });
    return navigator.clipboard.write([item]);
  });
};

export const useCopySelection = (stageRef: React.RefObject<Stage>) => {
  const dispatch = useAppDispatch();
  const { isCopying } = useAppSelector(state => state.canvas);
  const { selection } = useAppSelector(state => state.canvasMeta);
  const { zoom } = useAppSelector(state => state.browser);

  useEffect(() => {
    if (!isCopying) return;
    if (!stageRef.current) return;
    if (selection && stageRef.current.children) {
      let ctx = stageRef.current.children[1].canvas._canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(1 / zoom, 1 / zoom);
      const imageData = ctx.getImageData(
        selection.x - sd.width,
        selection.y - sd.height,
        selection.width,
        selection.height
      );
      console.log(imageData.width);
      copyImage(imageData, imageData.width, imageData.height);
    }
    dispatch(setIsCopying(false));
  }, [isCopying]);
};
