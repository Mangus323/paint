import { ToolType } from "@/types/canvas";

export const calculateMeta = (current: any, tool: ToolType) => {
  let result;
  const attrs = current.attrs;
  switch (tool) {
    case "text":
      result = {
        width: current?.textWidth || 0,
        height: current?.textHeight || 0,
        x: attrs.x,
        y: attrs.y
      };
      break;
    case "rect":
      result = {
        width: Math.abs(attrs.width),
        height: Math.abs(attrs.height),
        x: attrs.width < 0 ? attrs.x + attrs.width : attrs.x,
        y: attrs.height < 0 ? attrs.y + attrs.height : attrs.y
      };
      break;
    case "ellipse":
      result = {
        width: attrs.radiusX * 2,
        height: attrs.radiusY * 2,
        x: attrs.x - attrs.radiusX,
        y: attrs.y - attrs.radiusY
      };
      break;
  }
  return result;
};
