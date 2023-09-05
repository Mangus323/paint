import React, { JSX, ReactNode, useEffect } from "react";
import { sidebarDimension as sd, sp } from "@/globals/globals";
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
        canvasHeight: window.innerHeight - sd.height,
        verticalBar: {
          x: window.innerWidth - sd.width - sp - 10,
          y: sp
        },
        horizontalBar: {
          x: sp,
          y: window.innerHeight - sd.height - sp - 10
        }
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
