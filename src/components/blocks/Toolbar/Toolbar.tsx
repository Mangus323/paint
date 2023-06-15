import React, { JSX } from "react";
import { ToolPicker } from "@/components/blocks/Toolbar/ToolPicker/ToolPicker";
import s from "./index.module.scss";

export const Toolbar = (): JSX.Element => {
  return (
    <section className={s.container}>
      <ToolPicker />
      {/*<ColorPanel />*/}
    </section>
  );
};
