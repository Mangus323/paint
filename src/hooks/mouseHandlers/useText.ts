import { useActiveElement } from "@/hooks/useActiveElement";
import { useSettings } from "@/redux/slices/settings/selectors";
import { useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;

export const useText = () => {
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const { zoom, layerX, layerY } = useAppSelector(state => state.browser);
  const settings = useSettings("text");
  const { setNewActiveElement } = useActiveElement();

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "text") {
      const { x, y } = getPoints(e, zoom, {
        x: layerX,
        y: layerY
      });
      setNewActiveElement({
        text: "",
        x,
        y,
        tool: tool,
        rotation: 0,
        ...settings
      });
    }
  };

  return {
    handleClick
  };
};
