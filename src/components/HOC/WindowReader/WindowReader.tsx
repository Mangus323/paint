import React, { JSX, ReactNode, useEffect } from "react";
import { sidebarDimension as sd } from "@/globals/sidebar";
import { set } from "@/redux/slices/browser/reducer";
import { useAppDispatch } from "@/redux/store";

interface WindowReaderProps {
  children: ReactNode;
}

export const WindowReader = (props: WindowReaderProps): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      set({
        layerWidth: Math.min(window.innerWidth - sd.width, 800),
        layerHeight: Math.min(window.innerHeight - sd.height, 600),
        canvasWidth: window.innerWidth - sd.width,
        canvasHeight: window.innerHeight - sd.height
      })
    );
    const listener = () => {
      dispatch(
        set({
          canvasWidth: window.innerWidth - sd.width,
          canvasHeight: window.innerHeight - sd.height
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
