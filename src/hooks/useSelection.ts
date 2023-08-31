import { useContext, useEffect, useRef, useState } from "react";
import { MousePositionContext } from "@/components/HOC/MouseListener/MouseListener";
import {
  editSelect,
  endSelecting,
  startSelecting
} from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";

export const useSelection = () => {
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const { selection, isSelecting } = useAppSelector(state => state.canvasMeta);
  const dispatch = useAppDispatch();
  const position = useContext(MousePositionContext);
  const positionRef = useRef(position);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (tool === "selection") {
      document.addEventListener("mousedown", onMouseDown);
      document.addEventListener("mouseup", onMouseUp);
      setIsListening(true);
    } else if (isListening) {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      setIsListening(false);
    }
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [tool]);

  const onMouseDown = () => {
    dispatch(startSelecting(positionRef.current));
  };

  const onMouseUp = () => {
    dispatch(endSelecting());
  };

  useEffect(() => {
    positionRef.current = position;
    if (tool === "selection" && isSelecting && selection) {
      dispatch(
        editSelect({
          width: position.x - selection.x,
          height: position.y - selection.y
        })
      );
    }
  }, [position]);
};
