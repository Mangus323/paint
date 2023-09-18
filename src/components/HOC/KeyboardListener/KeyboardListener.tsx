"use client";

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
import { useGlobalEventListener } from "@/hooks/useGlobalEventListener";
import {
  changeTool,
  duplicate,
  edit,
  place,
  placeAndEdit,
  redo,
  setIsActiveElement,
  setIsCopying,
  setIsDownloading,
  undo
} from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { removeSelection, selectAll } from "@/redux/slices/canvasMeta/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IText } from "@/types/canvas";

interface KeyboardListenerProps {
  children: ReactNode;
}

export const KeyboardListener = (props: KeyboardListenerProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const { zoom, layerX, layerY, canvasWidth, canvasHeight } = useAppSelector(
    state => state.browser
  );
  const settings = useAppSelector(state => state.settings.tools.text);
  const position = useContext(MousePositionContext);
  const { isActiveElement, activeElement } = useActiveElement();
  const isActiveText = isActiveElement && tool === "text";
  const coordinate = {
    x: (position.x - sd.width - layerX) / zoom,
    y: (position.y - sd.height - layerY) / zoom
  };
  const pseudoInputRef = useRef<HTMLTextAreaElement>(null);

  const listener = useCallback(
    ({ canvasWidth, canvasHeight }, e: KeyboardEvent) => {
      switch (e.code) {
        case "Escape":
          dispatch(place());
          dispatch(removeSelection());
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
                width: canvasWidth,
                height: canvasHeight
              })
            );
            dispatch(setIsActiveElement(false));
            return;
          case "KeyD":
            e.preventDefault();
            dispatch(duplicate());
            return;
          case "KeyS":
            e.preventDefault();
            dispatch(place());
            dispatch(setIsDownloading(true));
        }
      }
      if (isActiveText) pseudoInputRef?.current?.focus();
    },
    []
  );

  const clipboardPaste = useCallback(
    ({ settings, tool, isActiveElement, coordinate }, e: Event) => {
      let clipboardData = (e as ClipboardEvent).clipboardData;
      if (!clipboardData) return;
      if (
        clipboardPasteText(
          clipboardData,
          settings,
          tool,
          isActiveElement,
          coordinate
        )
      )
        return;

      clipboardPasteImage(clipboardData, coordinate);
    },
    []
  );

  const clipboardPasteText = useCallback(
    (
      clipboardData: DataTransfer,
      settings,
      tool,
      isActiveElement,
      coordinate
    ) => {
      let text = clipboardData.getData("text/plain");
      if (!text) return false;
      if (tool === "text" && isActiveElement) {
        return true;
      }
      const { x, y } = coordinate;
      dispatch(changeTool("text"));
      dispatch(
        placeAndEdit({
          tool: "text",
          text: "",
          rotation: 0,
          x,
          y,
          ...settings
        })
      );
      return true;
    },
    []
  );
  const clipboardPasteImage = useCallback(
    (clipboardData: DataTransfer, coordinate) => {
      if (!clipboardData.files || !clipboardData.files[0]) return;
      const reader = new FileReader();
      if (clipboardData.files[0].type.match(/^image\//)) {
        const file = clipboardData.files[0];
        let { x, y } = coordinate;
        reader.onloadend = () => {
          if (!reader.result) return;
          dispatch(
            placeAndEdit({
              tool: "image",
              src: reader.result,
              x,
              y
              // TODO
              // scaleY: 0.25,
              // scaleX: 0.25
            })
          );
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const clipboardCopy = useCallback(() => {
    dispatch(setIsCopying(true));
  }, []);

  const onPseudoInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(edit({ text: e.target.value }));
  };

  useGlobalEventListener("window", "paste", clipboardPaste, {
    settings,
    tool,
    isActiveElement,
    coordinate
  });
  useGlobalEventListener("window", "copy", clipboardCopy);
  useGlobalEventListener("document", "keydown", listener, {
    canvasWidth,
    canvasHeight
  });

  useEffect(() => {
    if (isActiveText) {
      pseudoInputRef?.current?.focus();
    }
  }, [activeElement, tool]);

  return (
    <>
      {isActiveText && (
        <textarea
          ref={pseudoInputRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            maxWidth: 0,
            maxHeight: 0,
            opacity: 0
          }}
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
