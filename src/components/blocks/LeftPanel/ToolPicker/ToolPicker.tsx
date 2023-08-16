import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { Separator } from "@/components/elements/Separator/Separator";
import { changeTool, redo, undo } from "@/redux/slices/canvas/reducer";
import { AppDispatch, RootState } from "@/redux/store";
import { ToolType } from "@/types/canvas";
import { ToolList } from "@/types/const";
import { useDispatch, useSelector } from "react-redux";
import ArrowLeftIcon from "~public/icons/ArrowLeft.svg";
import ArrowRightIcon from "~public/icons/ArrowRight.svg";
import CircleIcon from "~public/icons/Circle.svg";
import EraserIcon from "~public/icons/Eraser.svg";
import PencilIcon from "~public/icons/Pencil.svg";
import SquareIcon from "~public/icons/Square.svg";
import TextIcon from "~public/icons/Text.svg";

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
  const toolListIcons = [
    SquareIcon,
    PencilIcon,
    TextIcon,
    EraserIcon,
    CircleIcon
  ];

  return (
    <>
      <ul>
        <li>
          <Button onClick={onClickUndo}>
            <ArrowLeftIcon />
          </Button>
        </li>
        <li>
          <Button onClick={onClickRedo}>
            <ArrowRightIcon />
          </Button>
        </li>
      </ul>
      <Separator orientation={"horizontal"} />
      <h3>Tools</h3>
      <ul>
        {ToolList.map((tool, index) => {
          const Icon = toolListIcons[index];
          return (
            <li key={tool}>
              <Button
                selected={selectedTool === tool}
                onClick={() => onClick(tool)}>
                <Icon />
              </Button>
            </li>
          );
        })}
      </ul>
    </>
  );
};