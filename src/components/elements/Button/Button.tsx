import React, { JSX } from "react";
import clsx from "clsx";
import s from "./index.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  styleType?: "icon" | "default";
}

export const Button = (props: ButtonProps): JSX.Element => {
  const {
    className,
    children,
    selected,
    styleType = "icon",
    ...buttonProps
  } = props;
  return (
    <button
      className={clsx(
        s.container,
        className,
        selected && s.selected,
        styleType === "icon" && s.icon,
        styleType === "default" && s.default
      )}
      {...buttonProps}>
      {children}
    </button>
  );
};
