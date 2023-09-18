import React, { JSX } from "react";
import {
  Box,
  ButtonProps as MuiButtonProps,
  SxProps,
  Theme
} from "@mui/material";

interface ButtonProps extends MuiButtonProps {
  selected?: boolean;
  styleType?: "icon" | "default";
}

const iconStyle: SxProps<Theme> = {
  width: "1.25rem"
};

const defaultStyle: SxProps<Theme> = {
  padding: "2px 4px"
};

const selectedStyle: SxProps<Theme> = {
  backgroundColor: "var(--yellow)"
};

export const Button = (props: ButtonProps): JSX.Element => {
  const {
    className,
    children,
    selected,
    styleType = "icon",
    sx,
    ...buttonProps
  } = props;

  return (
    <Box
      component={"button"}
      sx={{
        fontSize: 12,
        position: "relative",
        display: "flex",
        height: "1.25rem",
        alignItems: "center",
        justifyContent: "center",
        padding: 0.125,
        border: "1px solid var(--teal-200)",
        borderRadius: 0.5,
        backgroundColor: "var(--teal-100)",
        color: "var(--blue)",
        gap: 1.25,
        gridGap: 1.25,
        outline: "none",
        transition: "0.1s all",
        userSelect: "none",
        "&:hover": {
          border: "1px solid var(--black)"
        },
        "&:active": {
          border: "1px solid var(--black)",
          backgroundColor: "var(--teal-300)"
        },
        "&:disabled": {
          border: "1px solid var(--gray)",
          background: "var(--gray)",
          cursor: "default"
        },
        ...(styleType === "icon" && iconStyle),
        ...(styleType === "default" && defaultStyle),
        ...(selected && selectedStyle),
        ...sx
      }}
      {...buttonProps}>
      {children}
    </Box>
  );
};
