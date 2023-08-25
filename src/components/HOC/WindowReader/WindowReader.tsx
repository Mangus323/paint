import React, { JSX, ReactNode, useEffect } from "react";
import { set } from "@/redux/slices/browser/reducer";
import { useAppDispatch } from "@/redux/store";

interface WindowReaderProps {
  children: ReactNode;
}

export const WindowReader = (props: WindowReaderProps): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const listener = () => {
      dispatch(
        set({
          canvasWidth: window.innerWidth,
          canvasHeight: window.innerHeight
        })
      );
    };
    listener();
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
    };
  }, []);

  return <>{props.children}</>;
};
