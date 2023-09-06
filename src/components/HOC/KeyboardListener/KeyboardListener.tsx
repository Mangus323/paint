import React, {
  ChangeEvent,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef
} from "react";
import { MousePositionContext } from "@/components/HOC/MouseListener/MouseListener";
import { sidebarDimension as sd } from "@/globals/globals";
import {
  changeTool,
  duplicate,
  edit,
  place,
  placeAndEdit,
  redo,
  setIsActiveElement,
  setIsCopying,
  undo
} from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { selectAll } from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IText } from "@/types/canvas";
import s from "./index.module.scss";

interface KeyboardListenerProps {
  children: ReactNode;
}

export const KeyboardListener = (props: KeyboardListenerProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const { zoom, layerX, layerY, canvasWidth, canvasHeight } = useAppSelector(
    state => state.browser
  );
  const position = useContext(MousePositionContext);
  const { isActiveElement, activeElement } = useActiveElement();
  const isActiveText = isActiveElement && tool === "text";
  const coordinateRef = useRef(position);
  const pseudoInputRef = useRef<HTMLTextAreaElement>(null);
  const canvasDimensionRef = useRef({
    width: canvasWidth,
    height: canvasHeight
  });

  const listener = useCallback((e: KeyboardEvent) => {
    switch (e.code) {
      case "Escape":
        dispatch(place());
        return;
    }
    if (e.ctrlKey) {
      switch (e.code) {
        case "KeyZ":
          dispatch(undo());
          return;
        case "KeyY":
          dispatch(redo());
          return;
        case "KeyA":
          e.preventDefault();
          dispatch(
            selectAll({
              width: canvasDimensionRef.current.width,
              height: canvasDimensionRef.current.height
            })
          );
          dispatch(setIsActiveElement(false));
          return;
        case "KeyD":
          e.preventDefault();
          dispatch(duplicate());
      }
    }
    if (isActiveText) pseudoInputRef?.current?.focus();
  }, []);

  const clipboardPaste = useCallback((e: Event) => {
    let clipboardData = (e as ClipboardEvent).clipboardData;
    if (!clipboardData) return;
    if (clipboardPasteText(clipboardData)) return;
    clipboardPasteImage(clipboardData);
  }, []);

  const clipboardPasteText = (clipboardData: DataTransfer) => {
    let text = clipboardData.getData("text/plain");
    if (!text) return false;
    if (text && tool === "text") return true;
    const { x, y } = coordinateRef.current;
    dispatch(changeTool("text"));
    dispatch(
      placeAndEdit({
        tool: "text",
        text,
        rotation: 0,
        x,
        y
      })
    );
    return true;
  };

  const clipboardPasteImage = (clipboardData: DataTransfer) => {
    if (!clipboardData.files || !clipboardData.files[0]) return;
    const reader = new FileReader();
    if (clipboardData.files[0].type.match(/^image\//)) {
      const file = clipboardData.files[0];
      let { x, y } = coordinateRef.current;
      reader.onloadend = () => {
        if (!reader.result) return;
        dispatch(
          placeAndEdit({
            tool: "image",
            src: reader.result,
            x,
            y
          })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const clipboardCopy = useCallback(() => {
    dispatch(setIsCopying(true));
  }, []);

  const onPseudoInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(edit({ text: e.target.value }));
  };

  useEffect(() => {
    document.addEventListener("keydown", listener);
    window.addEventListener("paste", clipboardPaste);
    window.addEventListener("copy", clipboardCopy);
    return () => {
      document.removeEventListener("keydown", listener);
      window.removeEventListener("paste", clipboardPaste);
      window.removeEventListener("copy", clipboardCopy);
    };
  }, []);

  useEffect(() => {
    coordinateRef.current = {
      x: (position.x - sd.width - layerX) / zoom,
      y: (position.y - sd.height - layerY) / zoom
    };
  }, [position, zoom, layerX, layerY]);

  useEffect(() => {
    if (isActiveText) {
      pseudoInputRef?.current?.focus();
    }
  }, [activeElement, tool]);

  useEffect(() => {
    canvasDimensionRef.current = { width: canvasWidth, height: canvasHeight };
  }, [canvasWidth, canvasHeight]);

  return (
    <>
      {isActiveText && (
        <textarea
          ref={pseudoInputRef}
          className={s.input}
          tabIndex={-1}
          onChange={onPseudoInputChange}
          value={(activeElement as IText)?.text || ""}
          id={"pseudo"}
        />
      )}
      {props.children}
    </>
  );
};
