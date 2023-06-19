import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { Separator } from "@/components/elements/Separator/Separator";
import { changeTool, redo, undo } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { ToolType } from "@/types/canvas";
import { ToolList } from "@/types/const";
import { useDispatch, useSelector } from "react-redux";
import s from "./index.module.scss";

export const ToolPicker = (): JSX.Element => {
  const { selectedTool } = useSelector((state: RootState) => state.canvas);
  const dispatch: AppDispatch = useDispatch();

  const onClick = (tool: ToolType) => {
    dispatch(changeTool(tool));
  };

  const onClickUndo = () => {
    dispatch(undo());
  };
  const onClickRedo = () => {
    dispatch(redo());
  };

  return (
    <div className={s.container}>
      <div className={s.list}>
        <Button onClick={onClickUndo}>u</Button>
        <Button onClick={onClickRedo}>r</Button>
      </div>
      <Separator orientation={"horizontal"} />
      <div className={s.list}>
        {ToolList.map(tool => {
          return (
            <Button
              key={tool}
              selected={selectedTool === tool}
              onClick={() => onClick(tool)}>
              {tool[0]}
            </Button>
          );
        })}
      </div>
      <Separator orientation={"horizontal"} />
    </div>
  );
};
