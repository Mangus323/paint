import React, { useEffect } from "react";
import { setIsDownloading } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { downloadURI } from "@/utils/downloadURI";
import Konva from "konva";

import Stage = Konva.Stage;
import Group = Konva.Group;

export const useDownloadingImage = (stageRef: React.RefObject<Stage>) => {
  const dispatch = useAppDispatch();
  const { isDownloading } = useAppSelector(state => state.canvas);
  const browser = useAppSelector(state => state.browser);

  useEffect(() => {
    if (!isDownloading) return;
    const layerChildren = stageRef.current?.children;
    if (!layerChildren || !layerChildren[1].children) return;
    const group: Group = layerChildren[1].children[0].clone();
    group.scale({ x: 1, y: 1 });
    const uri = group.toDataURL({
      width: browser.layerWidth,
      height: browser.layerHeight,
      pixelRatio: 1
    });
    downloadURI(uri, "image");
    dispatch(setIsDownloading(false));
  }, [isDownloading]);
};
