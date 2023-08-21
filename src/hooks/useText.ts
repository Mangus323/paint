import { place, placeAndEdit } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { IText } from "@/types/canvas";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";

import KonvaEventObject = Konva.KonvaEventObject;

export const useText = () => {
  const { selectedTool: tool, activeElement } = useSelector(
    (state: RootState) => state.canvas
  );
  const dispatch: AppDispatch = useDispatch();

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "text") {
      if (activeElement && activeElement) {
        dispatch(place(activeElement));
        return;
      }
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

  const textShape: Omit<IText, "tool"> = {
    x: (activeElement as IText)?.x || 0,
    y: (activeElement as IText)?.y || 0,
    text: (activeElement as IText)?.text || "",
    rotation: (activeElement as IText)?.rotation || 0
  };

  return {
    handleClick,
    textShape
  };
};
