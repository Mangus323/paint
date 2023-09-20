import { forwardRef, useEffect, useState } from "react";
import { useActiveElement } from "@/hooks/useActiveElement";
import Konva from "konva";
import { Image as KonvaImage } from "react-konva";

import ImageConfig = Konva.ImageConfig;

export const CanvasImage = forwardRef<any, ImageConfig>((props, ref) => {
  const [image, setImage] = useState<HTMLImageElement | undefined>(undefined);
  const { activeElement, setActiveElement } = useActiveElement();

  useEffect(() => {
    loadImage();
  }, [props.src]);

  function loadImage() {
    const image = new window.Image();
    image.src = props.src;
    image.onload = () => {
      setImage(image);
      // rerender meta
      if (activeElement) setActiveElement({ ...activeElement });
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
