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
import { MousePositionContext } from "@/components/HOC/MouseListener";
import { ScrollContext } from "@/components/HOC/ScrollProvider";
import { sidebarDimension as sd } from "@/globals/globals";
import { useActiveElement } from "@/hooks/useActiveElement";
import { useGlobalEventListener } from "@/hooks/useGlobalEventListener";
import { setToast } from "@/redux/slices/browser/reducer";
import {
  duplicate,
  setIsCopying,
  setIsOpenDownloadModal
} from "@/redux/slices/canvas/reducer";
import { removeSelection, selectAll } from "@/redux/slices/canvasMeta/reducer";
import { useSettings } from "@/redux/slices/settings/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IText } from "@/types/canvas";

interface KeyboardListenerProps {
  children: ReactNode;
}

export const KeyboardListener = (props: KeyboardListenerProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { layerY, layerX } = useContext(ScrollContext).scroll;
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const { zoom, canvasWidth, canvasHeight } = useAppSelector(
    state => state.browser
  );
  const settings = useSettings("text");
  const position = useContext(MousePositionContext);
  const { activeElement, setActiveElement, setNewActiveElement, undo, redo } =
    useActiveElement();
  const isActiveText = activeElement && tool === "text";
  const coordinate = {
    x: (position.x - sd.width - layerX) / zoom,
    y: (position.y - sd.height - layerY) / zoom
  };
  const pseudoInputRef = useRef<HTMLTextAreaElement>(null);
  const activeElementRef = useRef(activeElement);

  const listener = useCallback(
    ({ canvasWidth, canvasHeight }, e: KeyboardEvent) => {
      switch (e.code) {
        case "Escape":
          setActiveElement(null);
          dispatch(removeSelection());
          return;
      }
      if (e.ctrlKey) {
        switch (e.code) {
          case "KeyZ":
            undo();
            return;
          case "KeyY":
            redo();
            return;
          case "KeyA":
            e.preventDefault();
            dispatch(
              selectAll({
                width: canvasWidth,
                height: canvasHeight
              })
            );
            setActiveElement(null);
            dispatch(setToast("select all"));
            return;
          case "KeyD":
            e.preventDefault();
            dispatch(duplicate(activeElementRef.current));
            dispatch(setToast("duplicate"));
            return;
          case "KeyS":
            e.preventDefault();
            if (activeElement) setActiveElement(null);
            dispatch(setIsOpenDownloadModal(true));
        }
      }
      if (isActiveText) pseudoInputRef?.current?.focus();
    },
    []
  );

  const clipboardPaste = useCallback(
    ({ settings, tool, activeElement, coordinate }, e: Event) => {
      let clipboardData = (e as ClipboardEvent).clipboardData;
      if (!clipboardData) return;
      if (
        clipboardPasteText(
          clipboardData,
          settings,
          tool,
          activeElement,
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
      activeElement,
      coordinate
    ) => {
      let text = clipboardData.getData("text/plain");
      if (!text) return false;
      if (tool === "text" && activeElement) return true;
      const { x, y } = coordinate;
      setNewActiveElement({
        tool: "text",
        text: text,
        rotation: 0,
        x,
        y,
        ...settings
      });
      dispatch(setToast("paste text"));
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

          setNewActiveElement({
            tool: "image",
            src: reader.result,
            x,
            y
            // TODO
            // scaleY: 0.25,
            // scaleX: 0.25
          });
          dispatch(setToast("paste image"));
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
    if (activeElement && "text" in activeElement)
      setActiveElement({
        ...activeElement,
        text: e.target.value
      });
  };

  useGlobalEventListener("window", "paste", clipboardPaste, {
    settings,
    tool,
    activeElement,
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

  useEffect(() => {
    activeElementRef.current = activeElement;
  }, [activeElement]);

  return (
    <>
      {
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
      }
      {props.children}
    </>
  );
};
