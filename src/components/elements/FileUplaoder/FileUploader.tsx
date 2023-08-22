import React, { JSX } from "react";
import clsx from "clsx";
import s from "./index.module.scss";

interface FileUploaderProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const FileUploader = (props: FileUploaderProps): JSX.Element => {
  const { children, className, ...inputProps } = props;
  return (
    <label className={s.container}>
      <input
        className={s.input}
        type={"file"}
        {...inputProps}
        accept={"image/png"}
      />
      <span className={clsx(className, s.button)}>{children}</span>
    </label>
  );
};
