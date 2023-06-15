import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import s from "./index.module.scss";

export const ToolPicker = (): JSX.Element => {
  return (
    <div className={s.container}>
      <Button>ABC</Button>
    </div>
  );
};
