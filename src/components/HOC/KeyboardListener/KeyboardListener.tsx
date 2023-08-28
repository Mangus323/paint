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
import { sidebarDimension } from "@/globals/sidebar";
import {
  edit,
  placeAndEdit,
  redo,
  setIsCopying,
  undo
} from "@/redux/slices/canvas/reducer";
import { useActiveElement } from "@/redux/slices/canvas/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { IText } from "@/types/canvas";
import s from "./index.module.scss";

interface KeyboardListenerProps {
  children: ReactNode;
}

export const KeyboardListener = (props: KeyboardListenerProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const { selectedTool: tool } = useAppSelector(state => state.canvas);
  const position = useContext(MousePositionContext);
  const pseudoInputRef = useRef<HTMLTextAreaElement>(null);
  const { isActiveElement, activeElement } = useActiveElement();
  const positionRef = useRef(position);
  const isActiveText = isActiveElement && tool === "text";

  const listener = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey) {
      switch (e.code) {
        case "KeyZ":
          dispatch(undo());
          return;
        case "KeyY":
          dispatch(redo());
          return;
      }
    }
    if (isActiveText) pseudoInputRef?.current?.focus();
  }, []);

  const clipboardPaste = useCallback((e: Event) => {
    let clipboardData = (e as ClipboardEvent).clipboardData;
    if (!clipboardData) return;
    if (!clipboardData.files || !clipboardData.files[0]) return;
    const reader = new FileReader();
    if (clipboardData.files[0].type.match(/^image\//)) {
      const file = clipboardData.files[0];
      let { x, y } = positionRef.current;
      reader.onloadend = () => {
        if (!reader.result) return;
        dispatch(
          placeAndEdit({
            tool: "image",
            src: reader.result,
            x: x - sidebarDimension.width,
            y: y - sidebarDimension.height
          })
        );
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const clipboardCopy = useCallback(() => {
    dispatch(setIsCopying(true));
  }, []);

  const onPseudoInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(edit({ text: e.target.value }));
  };

  useEffect(() => {
    document.addEventListener("keypress", listener);
    window.addEventListener("paste", clipboardPaste);
    window.addEventListener("copy", clipboardCopy);
    return () => {
      document.removeEventListener("keypress", listener);
      window.removeEventListener("paste", clipboardPaste);
      window.removeEventListener("copy", clipboardCopy);
    };
  }, []);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

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
