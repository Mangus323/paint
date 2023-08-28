import React, { useEffect } from "react";
import { setIsDownloading } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { downloadURI } from "@/utils/downloadURI";
import Konva from "konva";

import Stage = Konva.Stage;

export const useDownloadingImage = (stageRef: React.RefObject<Stage>) => {
  const dispatch = useAppDispatch();
  const { isDownloading } = useAppSelector(state => state.canvas);

  useEffect(() => {
    if (!isDownloading) return;
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
    downloadURI(uri, "image");
    dispatch(setIsDownloading(false));
  }, [isDownloading]);
};
