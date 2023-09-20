import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { useActiveElement } from "@/hooks/useActiveElement";
import { setColor } from "@/redux/slices/settings/reducer";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/redux/store";
import { Box } from "@mui/material";

export const ColorPanel = (): JSX.Element => {
  const { selectedColor } = useAppSelector(state => state.settings);
  const dispatch: AppDispatch = useAppDispatch();
  const { activeElement, setActiveElement } = useActiveElement();

  const onSetColor = (color: string) => {
    dispatch(setColor(color));
    if (activeElement)
      setActiveElement({
        ...activeElement,
        color: color
      });
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
      <Box
        sx={{
          width: "100%",
          marginBottom: "-2px",
          aspectRatio: 1
        }}
        style={{ backgroundColor: selectedColor }}
      />
      <p>current</p>
      <ul>
        {defaultColors.map(color => {
          return (
            <li key={color}>
              <Button onClick={() => onSetColor(color)}>
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: 1
                  }}
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
