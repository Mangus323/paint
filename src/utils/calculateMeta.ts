import { sidebarDimension } from "@/globals/sidebar";
import { IElementMeta } from "@/types/canvas";

export const calculateMetaSelection = (rawMeta: IElementMeta) => {
  const x = rawMeta.x - sidebarDimension.width;
  const y = rawMeta.y - sidebarDimension.height;
  return {
    width: Math.abs(rawMeta.width),
    height: Math.abs(rawMeta.height),
    x: rawMeta.width < 0 ? x + rawMeta.width : x,
    y: rawMeta.height < 0 ? y + rawMeta.height : y
  };
};
