import { useState } from "react";
import { place, placeAndEdit } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { IText } from "@/types/canvas";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";

import KonvaEventObject = Konva.KonvaEventObject;

export const useText = () => {
  const {
    selectedTool: tool,
    activeElement,
    isActiveElement
  } = useSelector((state: RootState) => state.canvas);
  const dispatch: AppDispatch = useDispatch();
  const [startPoints, setStartPoints] = useState<number[]>([0, 0]);

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "text") {
      if (isActiveElement && activeElement) {
        dispatch(place(activeElement));
        return;
      }

      const { x, y } = getPoints(e);
      setStartPoints([x, y]);
      dispatch(
        placeAndEdit({
          text: "",
          x,
          y,
          tool: tool
        })
      );
    }
  };
  const textShape: Omit<IText, "tool"> = {
    x: startPoints[0],
    y: startPoints[1],
    text: (activeElement as IText)?.text || ""
  };

  // const handleMouseUp = () => {
  //   isFocus.current = false;
  //   if (tool === "text") {
  //     dispatch(
  //       place({
  //         x: startPoints[0],
  //         y: startPoints[1],
  //         text,
  //         tool: tool
  //       })
  //     );
  //
  //     setStartPoints([]);
  //   }
  // };

  return {
    handleClick,
    textShape
  };
};
