import React, { JSX } from "react";
import clsx from "clsx";
import s from "./index.module.scss";

type OrientationType = "vertical" | "horizontal";

interface SeparatorProps {
  orientation: OrientationType;
}

export const Separator = (props: SeparatorProps): JSX.Element => {
  const { orientation } = props;
  return (
    <div
      className={clsx(
        s.container,
        orientation === "vertical" ? s.vertical : s.horizontal
      )}
    />
  );
};
