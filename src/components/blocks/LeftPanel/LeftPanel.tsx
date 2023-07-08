import React, { JSX } from "react";
import { ColorPanel } from "@/components/blocks/LeftPanel/ColorPanel/ColorPanel";
import { ToolPicker } from "@/components/blocks/LeftPanel/ToolPicker/ToolPicker";
import { Separator } from "@/components/elements/Separator/Separator";
import s from "./index.module.scss";

export const LeftPanel = (): JSX.Element => {
  return (
    <section className={s.container}>
      <ToolPicker />
      <Separator orientation={"horizontal"} />
      <ColorPanel />
    </section>
  );
};
