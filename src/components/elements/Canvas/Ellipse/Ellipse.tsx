import React, { JSX, forwardRef } from "react";
import { IFigure } from "@/types/canvas";
import Konva from "konva";
import { Ellipse } from "react-konva";

interface EllipseProps extends Omit<IFigure, "tool"> {
  color?: string;
}

export const CustomEllipse = forwardRef<
  any,
  EllipseProps & Konva.EllipseConfig
>((props, ref): JSX.Element => {
  const { x, y, width, height, color, ...otherProps } = props;
  return (
    <Ellipse
      {...otherProps}
      x={(x + width + x) / 2}
      y={(y + height + y) / 2}
      radiusX={Math.abs(width / 2)}
      radiusY={Math.abs(height / 2)}
      ref={ref}
    />
  );
});
CustomEllipse.displayName = "CustomEllipse";
