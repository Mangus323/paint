import React, { JSX } from "react";
import s from "./index.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

export const DefaultLayout = ({ children }: LayoutProps): JSX.Element => {
  return <main className={s.container}>{children}</main>;
};
