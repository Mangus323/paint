import { forwardRef, useEffect, useState } from "react";
import { changeMeta } from "@/redux/slices/editActiveElement/reducer";
import { useAppDispatch } from "@/redux/store";
import Konva from "konva";
import { Image as KonvaImage } from "react-konva";

import ImageConfig = Konva.ImageConfig;

export const CanvasImage = forwardRef<any, ImageConfig>((props, ref) => {
  const dispatch = useAppDispatch();
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);

  useEffect(() => {
    loadImage();
  }, [props.src]);

  useEffect(() => {
    if (image) {
      dispatch(
        changeMeta({
          x: props.x,
          y: props.y,
          width: image.width,
          height: image.height
        })
      );
    }
  }, [image]);

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
