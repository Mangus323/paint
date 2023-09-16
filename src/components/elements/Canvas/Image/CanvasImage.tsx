import { forwardRef, useEffect, useState } from "react";
import { edit } from "@/redux/slices/canvas/reducer";
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

  function loadImage() {
    const image = new window.Image();
    image.src = props.src;
    image.onload = () => {
      setImage(image);
      dispatch(edit({}));
    };
  }

  return (
    <KonvaImage
      {...props}
      image={image}
      ref={image ? ref : undefined}></KonvaImage>
  );
});

CanvasImage.displayName = "CanvasImage";
