import { forwardRef, useEffect, useState } from "react";
import { changeMeta } from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch } from "@/redux/store";
import Konva from "konva";
import { Image as KonvaImage } from "react-konva";

import ImageConfig = Konva.ImageConfig;

export const CanvasImage = forwardRef<any, ImageConfig>((props, ref) => {
  const { x, y } = props;
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);

  useEffect(() => {
    loadImage();
  }, [props.src]);

  useEffect(() => {
    if (image) {
      dispatch(
        changeMeta({
          x: x,
          y: y,
          width: image.width,
          height: image.height
        })
      );
    }
  }, [image, x, y]);

  function loadImage() {
    const image = new window.Image();
    image.src = props.src;
    image.onload = () => {
      setImage(image);
    };
  }

  return <KonvaImage {...props} image={image} ref={ref}></KonvaImage>;
});

CanvasImage.displayName = "CanvasImage";
