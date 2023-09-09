import React, { JSX, useEffect, useState } from "react";
import { ToolSettingsPen } from "@/components/blocks/ToolSettings/ToolSettingsPen";
import { ToolSettingsRect } from "@/components/blocks/ToolSettings/ToolSettingsRect";
import { Button } from "@/components/elements/Button/Button";
import { Popover } from "@/components/elements/Popover/Popover";
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

const toolListIcons = [
  SquareIcon,
  PencilIcon,
  TextIcon,
  EraserIcon,
  CircleIcon,
  LineIcon,
  SelectionIcon
];

export const ToolPicker = (): JSX.Element => {
  const { selectedTool, elements, history } = useAppSelector(
    state => state.canvas
  );
  const settings = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activePopover, setActivePopover] = useState<ToolType | null>(null);

  const onClickUndo = () => {
    dispatch(undo());
  };

  const onClickRedo = () => {
    dispatch(redo());
  };

  const onClick = (tool: ToolType) => {
    dispatch(changeTool(tool));
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLElement>, tool: ToolType) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
    setActivePopover(tool);
  };

  const onContextMenu = (e: React.MouseEvent<HTMLElement>, tool: ToolType) => {
    e.preventDefault();
    onClick(tool);
    onDoubleClick(e, tool);
  };

  const onClosePopper = () => {
    setAnchorEl(null);
    setActivePopover(null);
  };

  useEffect(() => {}, [settings, anchorEl]);

  return (
    <>
      <ul>
        <li>
          <Button onClick={onClickUndo} disabled={elements.length === 0}>
            <ArrowLeftIcon />
          </Button>
        </li>
        <li>
          <Button onClick={onClickRedo} disabled={history.length === 0}>
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
                onClick={() => onClick(tool)}
                onDoubleClick={e => {
                  onDoubleClick(e, tool);
                }}
                onContextMenu={e => onContextMenu(e, tool)}
                aria-describedby={anchorEl ? `tool-${index}` : undefined}>
                <Icon />
              </Button>
            </li>
          );
        })}
      </ul>
      <Popover
        id={anchorEl ? `tool-${activePopover}` : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={onClosePopper}>
        {activePopover === "rect" && <ToolSettingsRect />}
        {activePopover === "pen" && <ToolSettingsPen />}
      </Popover>
    </>
  );
};
