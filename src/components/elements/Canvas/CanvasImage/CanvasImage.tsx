import { useEffect, useState } from "react";
import { Image as KonvaImage } from "react-konva";

export const CanvasImage = props => {
  const [image, setImage] = useState<any>(undefined);

  useEffect(() => {
    loadImage();
  }, [props.src]);

  function loadImage() {
    const image = new window.Image();
    image.src = props.src;
    image.onload = () => {
      setImage(image);
    };
  }

  return <KonvaImage image={image} x={props.x} y={props.y}></KonvaImage>;
};
