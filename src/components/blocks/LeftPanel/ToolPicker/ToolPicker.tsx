import React, { JSX } from "react";
import { Button } from "@/components/elements/Button/Button";
import { Separator } from "@/components/elements/Separator/Separator";
import { changeTool, redo, undo } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ToolType } from "@/types/canvas";
import { ToolList } from "@/types/const";
import ArrowLeftIcon from "~public/icons/ArrowLeft.svg";
import ArrowRightIcon from "~public/icons/ArrowRight.svg";
import CircleIcon from "~public/icons/Circle.svg";
import EraserIcon from "~public/icons/Eraser.svg";
import LineIcon from "~public/icons/Line.svg";
import PencilIcon from "~public/icons/Pencil.svg";
import SelectionIcon from "~public/icons/Selection.svg";
import SquareIcon from "~public/icons/Square.svg";
import TextIcon from "~public/icons/Text.svg";

export const ToolPicker = (): JSX.Element => {
  const { selectedTool } = useAppSelector(state => state.canvas);
  const dispatch = useAppDispatch();

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
    CircleIcon,
    LineIcon,
    SelectionIcon
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
          if (!Icon) return null;
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
