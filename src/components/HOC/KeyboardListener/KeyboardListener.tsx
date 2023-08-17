import React, {
  ChangeEvent,
  JSX,
  ReactNode,
  useCallback,
  useEffect,
  useRef
} from "react";
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
  const { selectedTool: tool, activeElement } = useSelector(
    (state: RootState) => state.canvas
  );
  const isActiveText = activeElement && tool === "text";

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
