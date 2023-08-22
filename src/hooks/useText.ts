import { placeAndEdit } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";

import KonvaEventObject = Konva.KonvaEventObject;

export const useText = () => {
  const { selectedTool: tool } = useSelector(
    (state: RootState) => state.canvas
  );
  const dispatch: AppDispatch = useDispatch();

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
