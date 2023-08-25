import { placeAndEdit } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";

import KonvaEventObject = Konva.KonvaEventObject;

export const useText = () => {
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const dispatch = useAppDispatch();

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "text") {
      const { x, y } = getPoints(e);
      dispatch(
        placeAndEdit({
          text: "",
          x,
          y,
          tool: tool,
          rotation: 0
        })
      );
    }
  };

  return {
    handleClick
  };
};
