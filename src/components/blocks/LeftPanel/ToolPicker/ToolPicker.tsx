import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { Separator } from "@/components/elements/Separator/Separator";
import { changeTool, redo, undo } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { ToolType } from "@/types/canvas";
import { ToolList } from "@/types/const";
import { useDispatch, useSelector } from "react-redux";

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
    <>
      <ul>
        <li>
          <Button onClick={onClickUndo}>u</Button>
        </li>
        <li>
          <Button onClick={onClickRedo}>r</Button>
        </li>
      </ul>
      <Separator orientation={"horizontal"} />
      <h3>Tools</h3>
      <ul>
        {ToolList.map(tool => {
          return (
            <li key={tool}>
              <Button
                selected={selectedTool === tool}
                onClick={() => onClick(tool)}>
                {tool[0]}
              </Button>
            </li>
          );
        })}
      </ul>
    </>
  );
};
