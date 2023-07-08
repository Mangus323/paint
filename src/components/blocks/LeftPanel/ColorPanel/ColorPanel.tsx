import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { changeColor } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import s from "./index.module.scss";

export const ColorPanel = (): JSX.Element => {
  const { selectedColor } = useSelector((state: RootState) => state.canvas);
  const dispatch: AppDispatch = useDispatch();

  const setColor = (color: string) => {
    dispatch(changeColor(color));
  };

  const defaultColors = [
    "#FFFFFF",
    "#000000",
    "#ED7D31",
    "#4472C4",
    "#70AD47",
    "#FFC000",
    "#A5A5A5",
    "#F24C3D",
    "#22A699",
    "#6554AF"
  ];

  return (
    <>
      <h3>Colors</h3>
      <div
        className={s.selected_color}
        style={{ backgroundColor: selectedColor }}
      />
      <p>current</p>
      <ul>
        {defaultColors.map(color => {
          return (
            <li key={color}>
              <Button onClick={() => setColor(color)}>
                <div
                  className={s.color_button}
                  style={{ backgroundColor: color }}
                />
              </Button>
            </li>
          );
        })}
      </ul>
    </>
  );
};
