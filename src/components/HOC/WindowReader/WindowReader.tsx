import React, { JSX, ReactNode, useEffect } from "react";
import { set } from "@/redux/slices/browser/reducer";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";

interface WindowReaderProps {
  children: ReactNode;
}

export const WindowReader = (props: WindowReaderProps): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();

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
