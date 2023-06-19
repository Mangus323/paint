import React, { JSX } from "react";
import clsx from "clsx";
import s from "./index.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
}

export const Button = (props: ButtonProps): JSX.Element => {
  const { className, children, selected, ...buttonProps } = props;
  return (
    <button
      className={clsx(s.container, className, selected && s.selected)}
      {...buttonProps}>
      {children}
    </button>
  );
};
