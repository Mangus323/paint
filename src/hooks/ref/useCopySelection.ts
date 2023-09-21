import React, { useEffect } from "react";
import { sidebarDimension as sd } from "@/globals/globals";
import { setIsCopying } from "@/redux/slices/canvas/reducer";
import { setToast } from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Konva from "konva";

import Stage = Konva.Stage;

export const useCopySelection = (stageRef: React.RefObject<Stage>) => {
  const dispatch = useAppDispatch();
  const { isCopying } = useAppSelector(state => state.canvas);
  const { selection } = useAppSelector(state => state.canvasMeta);
  const { layerX, layerY } = useAppSelector(state => state.browser);

  useEffect(() => {
    if (!isCopying) return;
    if (!stageRef.current) return;
    if (selection && stageRef.current.children) {
      let ctx = stageRef.current.children[1]
        .getNativeCanvasElement()
        .getContext("2d");
      if (!ctx) return;

      const imageData = ctx.getImageData(
        selection.x - sd.width + layerX,
        selection.y - sd.height + layerY,
        selection.width,
        selection.height
      );
      copyImage(imageData);
      dispatch(setToast("copy selection"));
    }
    dispatch(setIsCopying(false));
  }, [isCopying]);
};

const copyImage = (imageData: ImageData) => {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.putImageData(imageData, 0, 0);
  canvas.toBlob(blob => {
    if (!blob) return;
    const item = new ClipboardItem({ "image/png": blob });
    return navigator.clipboard.write([item]);
  });
};
