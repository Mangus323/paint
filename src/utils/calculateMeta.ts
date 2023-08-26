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
    case "pen":
    case "eraser":
    case "line": {
      result = {};
      const p = attrs.points;
      let min = Infinity,
        max = 0;
      for (let i = 0; i < p.length; i += 2) {
        min = Math.min(min, p[i]);
        max = Math.max(max, p[i]);
      }
      result.width = max - min;
      result.x = min + attrs.x;
      min = Infinity;
      max = 0;
      for (let i = 1; i < p.length; i += 2) {
        min = Math.min(min, p[i]);
        max = Math.max(max, p[i]);
      }
      result.height = max - min;
      result.y = min + attrs.y;
    }
  }
  return result;
};
