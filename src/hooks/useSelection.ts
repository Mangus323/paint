import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MousePositionContext } from "@/components/HOC/MouseListener/MouseListener";
import {
  changeSelectionZoom,
  editSelection,
  endSelecting,
  startSelecting
} from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";

export const useSelection = () => {
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const { selection, isSelecting } = useAppSelector(state => state.canvasMeta);
  const { zoom, layerX, layerY } = useAppSelector(state => state.browser);
  const dispatch = useAppDispatch();
  const position = useContext(MousePositionContext);
  const [isListening, setIsListening] = useState(false);
  const coordinateRef = useRef({
    position,
    zoom,
    layerX,
    layerY
  });

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

  const onMouseDown = useCallback(() => {
    const { layerX, layerY, position } = coordinateRef.current;
    dispatch(
      startSelecting({
        x: position.x - layerX,
        y: position.y - layerY,
        currentZoom: coordinateRef.current.zoom
      })
    );
  }, []);

  const onMouseUp = useCallback(() => {
    dispatch(endSelecting());
  }, []);

  useEffect(() => {
    if (tool === "selection" && isSelecting && selection) {
      dispatch(
        editSelection({
          width: (position.x - selection.x - layerX) / zoom,
          height: (position.y - selection.y - layerY) / zoom
        })
      );
    }
  }, [position]);

  useEffect(() => {
    if (tool === "selection" && selection) {
      dispatch(changeSelectionZoom(zoom));
    }
  }, [zoom]);

  useEffect(() => {
    coordinateRef.current = {
      zoom,
      position,
      layerX,
      layerY
    };
  }, [zoom, position, layerY, layerX]);
};
