import React, { JSX } from "react";
import clsx from "clsx";
import s from "./index.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = (props: ButtonProps): JSX.Element => {
  const { className, children, ...buttonProps } = props;
  return (
    <button className={clsx(s.container, className)} {...buttonProps}>
      {children}
    </button>
  );
};
