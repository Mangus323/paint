import { useEffect } from "react";
import { setIsDownloading } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { downloadURI } from "@/utils/downloadURI";

export const useDownloadingImage = stageRef => {
  const dispatch = useAppDispatch();
  const { isDownloading } = useAppSelector(state => state.canvas);

  useEffect(() => {
    if (isDownloading) {
      if (stageRef.current) {
        const uri = stageRef.current.toDataURL({ pixelRatio: 1 });
        downloadURI(uri, "image");
      }
      dispatch(setIsDownloading(false));
    }
  }, [isDownloading]);
};
