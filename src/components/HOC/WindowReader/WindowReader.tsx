import React, { JSX, ReactNode, useEffect } from "react";
import { sidebarDimension as sd, sp } from "@/globals/globals";
import { set } from "@/redux/slices/browser/reducer";
import { stopDraw } from "@/redux/slices/canvas/reducer";
import { useAppDispatch } from "@/redux/store";

interface WindowReaderProps {
  children: ReactNode;
}

export const WindowReader = (props: WindowReaderProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const onResize = () => {
    dispatch(
      set({
        canvasWidth: window.innerWidth - sd.width,
        canvasHeight: window.innerHeight - sd.height
      })
    );
  };

  const onBlur = () => {
    dispatch(stopDraw());
  };

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
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  return <>{props.children}</>;
};
