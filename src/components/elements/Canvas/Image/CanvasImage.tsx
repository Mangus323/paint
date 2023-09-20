import { forwardRef, useEffect, useState } from "react";
import { useActiveElement } from "@/hooks/useActiveElement";
import { IImage } from "@/types/canvas";
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
      if (!ref || !activeElement) return;
      const imageRef = (ref as any).current as Konva.Image;
      const offsetX = imageRef.width() / 2;
      const offsetY = imageRef.height() / 2;
      setActiveElement({
        ...activeElement,
        offsetX,
        offsetY,
        x: imageRef.position().x + offsetX,
        y: imageRef.position().y + offsetY
      } as IImage);
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
