import React, { JSX } from "react";
import { IFigure } from "@/types/canvas";
import { Ellipse } from "react-konva";

interface EllipseProps extends Omit<IFigure, "tool"> {
  color?: string;
}

export const CustomEllipse = (props: EllipseProps): JSX.Element => {
  const { x, y, width, height, color, ...otherProps } = props;
  return (
    <Ellipse
      x={(x + width + x) / 2}
      y={(y + height + y) / 2}
      radiusX={Math.abs(width / 2)}
      radiusY={Math.abs(height / 2)}
      fill={color}
      {...otherProps}
    />
  );
};
