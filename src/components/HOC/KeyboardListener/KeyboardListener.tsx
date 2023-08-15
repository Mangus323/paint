import React, { ChangeEvent, JSX, ReactNode, useEffect, useRef } from "react";
import { edit, redo, undo } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { IText } from "@/types/canvas";
import { useDispatch, useSelector } from "react-redux";
import s from "./index.module.scss";

interface KeyboardListenerProps {
  children: ReactNode;
}

export const KeyboardListener = (props: KeyboardListenerProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const pseudoInputRef = useRef<HTMLTextAreaElement>(null);
  const {
    selectedTool: tool,
    isActiveElement,
    activeElement
  } = useSelector((state: RootState) => state.canvas);

  const listener = (e: KeyboardEvent) => {
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
    if (isActiveElement && tool === "text") pseudoInputRef?.current?.focus();
  };

  const onPseudoInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(edit({ text: e.target.value }));
  };

  useEffect(() => {
    document.addEventListener("keypress", listener);
    return () => {
      document.removeEventListener("keypress", listener);
    };
  }, []);

  useEffect(() => {
    if (isActiveElement && tool === "text") pseudoInputRef?.current?.focus();
  }, [isActiveElement, tool]);

  return (
    <>
      <textarea
        ref={pseudoInputRef}
        className={s.input}
        tabIndex={-1}
        onChange={onPseudoInputChange}
        value={(activeElement as IText)?.text || ""}
        id={"pseudo"}
      />
      {props.children}
    </>
  );
};
