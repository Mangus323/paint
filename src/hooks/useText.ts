import { placeAndEdit } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;
import Vector2d = Konva.Vector2d;

export const useText = (offset: Vector2d) => {
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const { zoom } = useAppSelector(state => state.browser);
  const settings = useAppSelector(state => state.settings).tools.text;
  const dispatch = useAppDispatch();

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "text") {
      const { x, y } = getPoints(e, zoom, offset);
      dispatch(
        placeAndEdit({
          text: "",
          x,
          y,
          tool: tool,
          rotation: 0,
          ...settings
        })
      );
    }
  };

  return {
    handleClick
  };
};
