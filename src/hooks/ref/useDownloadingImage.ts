import React, { useEffect } from "react";
import { setIsDownloading } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IElement } from "@/types/canvas";
import { downloadURI } from "@/utils/downloadURI";
import { getCanvasElementProps } from "@/utils/getCanvasElementProps";
import Konva from "konva";

import Stage = Konva.Stage;

export const useDownloadingImage = (stageRef: React.RefObject<Stage>) => {
  const dispatch = useAppDispatch();
  const { isDownloading, elements } = useAppSelector(state => state.canvas);
  const browser = useAppSelector(state => state.browser);

  useEffect(() => {
    if (!isDownloading) return;
    if (!stageRef.current || !stageRef.current.children) return;
    const uri = createPseudoLayer(elements).toDataURL({
      width: browser.layerWidth,
      height: browser.layerHeight,
      pixelRatio: 1
    });
    downloadURI(uri, "image");
    dispatch(setIsDownloading(false));
  }, [isDownloading]);
};

const createPseudoLayer = (elements: IElement[]) => {
  const layer = new Konva.Layer();

  elements.forEach(element => {
    let shape = getShape(element);
    // @ts-ignore
    layer.add(shape);
  });

  return layer;
};

const getShape = (element: IElement) => {
  const { tool, ...elementProps } = element;
  switch (tool) {
    case "rect":
      return new Konva.Rect({
        ...getCanvasElementProps(element),
        ...elementProps
      });
    case "ellipse":
      // @ts-ignore
      return new Konva.Ellipse({
        ...getCanvasElementProps(element),
        ...elementProps
      });
    case "pen":
    case "eraser":
      return new Konva.Line({
        ...getCanvasElementProps(element),
        ...elementProps
      });
    case "text":
      return new Konva.Text({
        ...getCanvasElementProps(element),
        ...elementProps
      });
    case "image":
      // @ts-ignore
      return new Konva.Image({
        ...getCanvasElementProps(element),
        ...elementProps
      });
  }
};
