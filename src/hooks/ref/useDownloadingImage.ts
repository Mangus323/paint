import React, { useEffect } from "react";
import { setIsDownloading } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { downloadURI } from "@/utils/downloadURI";
import Konva from "konva";

import Stage = Konva.Stage;

export const useDownloadingImage = (stageRef: React.RefObject<Stage>) => {
  const dispatch = useAppDispatch();
  const { isDownloading, elements } = useAppSelector(state => state.canvas);

  useEffect(() => {
    if (!isDownloading) return;
    if (!stageRef.current || !stageRef.current.children) return;
    const uri = createPseudoLayer().toDataURL({ pixelRatio: 1 });
    downloadURI(uri, "image");
    dispatch(setIsDownloading(false));
  }, [isDownloading]);

  const createPseudoLayer = () => {
    const layer = new Konva.Layer();
    try {
      elements.forEach(element => {
        // TODO update with real props
        let { tool, ...data } = element;
        let key = tool[0].toUpperCase() + tool.slice(1);
        layer.add(new Konva[key]({ ...data, fill: data.color }));
      });
    } catch (e) {
      console.log("Ctrl+S todo");
    }
    return layer;
  };
};
