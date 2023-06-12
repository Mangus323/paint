import React, { JSX } from "react";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import s from "./index.module.scss";

export const Canvas = (): JSX.Element => {
  const { canvasHeight, canvasWidth } = useSelector(
    (state: RootState) => state.browser
  );
  const dispatch: AppDispatch = useDispatch();

  return (
    <>
      <canvas
        className={s.container}
        width={canvasWidth}
        height={canvasHeight}
        style={{ width: canvasWidth, height: canvasHeight }}
      />
    </>
  );
};
