import { IElement, IRect } from "@/types/canvas";

export const getCanvasElementProps = (element: IElement) => {
  switch (element.tool) {
    case "rect":
      return {
        fill: element.color,
        fillEnabled: element.fillType === "fill",
        stroke: element.color,
        cornerRadius:
          Math.max(element.width, element.height) *
          ((element as IRect).cornerRadius / 100),
        dash:
          element.dashEnabled && element.fillType === "outline"
            ? [element.strokeWidth, element.strokeWidth * 2]
            : undefined
      };
    case "ellipse":
      return {
        fill: element.color,
        fillEnabled: element.fillType === "fill",
        stroke: element.color,
        dash:
          element.dashEnabled && element.fillType === "outline"
            ? [element.strokeWidth, element.strokeWidth * 2]
            : undefined,
        x: (element.x + element.width + element.x) / 2,
        y: (element.y + element.height + element.y) / 2,
        radiusX: Math.abs(element.width / 2),
        radiusY: Math.abs(element.height / 2)
      };
    case "pen":
      return {
        globalCompositeOperation: "source-over" as const,
        stroke: element.color,
        lineCap: "round" as const,
        lineJoin: "round" as const,
        dash: element.dashEnabled
          ? [element.strokeWidth, element.strokeWidth * 2]
          : undefined
      };
    case "line":
      return {
        stroke: element.color,
        dash: element.dashEnabled
          ? [element.strokeWidth, element.strokeWidth * 2]
          : undefined
      };
    case "eraser":
      return {
        stroke: "#ffffff",
        lineCap: "round" as const,
        lineJoin: "round" as const,
        globalCompositeOperation: "destination-out" as const
      };
    case "text":
      return {
        fill: element.color
      };
    case "image":
      return {
        image: element.src
      };
  }
};
