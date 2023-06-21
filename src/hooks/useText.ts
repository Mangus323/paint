import React, { useState } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { IText } from "@/types/canvas";
import { getPoints } from "@/utils/getCanvasPoints";
import Konva from "konva";
import { useDispatch, useSelector } from "react-redux";

import KonvaEventObject = Konva.KonvaEventObject;

export const useText = () => {
  const { selectedTool: tool } = useSelector(
    (state: RootState) => state.canvas
  );
  const dispatch: AppDispatch = useDispatch();
  const [startPoints, setStartPoints] = useState<number[]>([0, 0]);
  const [text, setText] = useState("токси хуебенс");
  const isFocus = React.useRef(false);

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === "text") {
      isFocus.current = true;
      const { x, y } = getPoints(e);
      setStartPoints([x, y]);
    }
  };

  const textShape: Omit<IText, "tool"> = {
    x: startPoints[0],
    y: startPoints[1],
    text: text
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
