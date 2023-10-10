import React, { useEffect } from "react";
import { setIsDownloading } from "@/redux/slices/canvas/reducer";
import {
  setDataURL,
  setDataURLPreview
} from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { downloadURI } from "@/utils/downloadURI";
import Konva from "konva";

import Stage = Konva.Stage;
import Group = Konva.Group;

export const useDownloadingImage = (stageRef: React.RefObject<Stage>) => {
  const dispatch = useAppDispatch();
  const { isDownloading, isOpenDownloadModal } = useAppSelector(
    state => state.canvas
  );
  const browser = useAppSelector(state => state.browser);
  const { imageScale, dataURL } = useAppSelector(state => state.canvasMeta);

  useEffect(() => {
    if (!isOpenDownloadModal) return;
    const layerChildren = stageRef.current?.children;
    if (!layerChildren || !layerChildren[1].children) return;
    const group: Group = layerChildren[1].children[0].clone();
    group.scale({ x: 0.5, y: 0.5 });
    const uri = group.toDataURL({
      width: browser.layerWidth * 0.5,
      height: browser.layerHeight * 0.5,
      pixelRatio: 1
    });
    dispatch(setDataURLPreview(uri));
  }, [isOpenDownloadModal]);

  useEffect(() => {
    if (!isOpenDownloadModal) return;
    const layerChildren = stageRef.current?.children;
    if (!layerChildren || !layerChildren[1].children) return;
    const group: Group = layerChildren[1].children[0].clone();
    group.scale({ x: imageScale, y: imageScale });
    const uri = group.toDataURL({
      width: browser.layerWidth * imageScale,
      height: browser.layerHeight * imageScale,
      pixelRatio: 1
    });
    dispatch(setDataURL(uri));
  }, [imageScale, isOpenDownloadModal]);

  useEffect(() => {
    if (dataURL && isDownloading) {
      downloadURI(dataURL, "image");
      dispatch(setIsDownloading(false));
    }
  }, [isDownloading, dataURL]);
};
