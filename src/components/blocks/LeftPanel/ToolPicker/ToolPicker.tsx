"use client";

import React, { JSX, useEffect, useState } from "react";
import { ToolSettingsEllipse } from "@/components/blocks/LeftPanel/ToolSettings/ToolSettingsEllipse";
import { ToolSettingsEraser } from "@/components/blocks/LeftPanel/ToolSettings/ToolSettingsEraser";
import { ToolSettingsLine } from "@/components/blocks/LeftPanel/ToolSettings/ToolSettingsLine";
import { ToolSettingsPen } from "@/components/blocks/LeftPanel/ToolSettings/ToolSettingsPen";
import { ToolSettingsPolygon } from "@/components/blocks/LeftPanel/ToolSettings/ToolSettingsPolygon";
import { ToolSettingsRect } from "@/components/blocks/LeftPanel/ToolSettings/ToolSettingsRect";
import { ToolSettingsText } from "@/components/blocks/LeftPanel/ToolSettings/ToolSettingsText";
import { Button } from "@/components/elements/Button/Button";
import { PolygonIcon } from "@/components/elements/PolygonIcon/PolygonIcon";
import { Popover } from "@/components/elements/Popover/Popover";
import { Separator } from "@/components/elements/Separator/Separator";
import { TableIcon } from "@/components/elements/TableIcon/TableIcon";
import { TextIcon } from "@/components/elements/TextIcon/TextIcon";
import { useActiveElement } from "@/hooks/useActiveElement";
import { changeTool } from "@/redux/slices/canvas/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ToolType } from "@/types/canvas";
import { ToolList } from "@/types/const";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { Tooltip } from "@mui/material";
import ArrowLeftIcon from "~public/icons/ArrowLeft.svg";
import ArrowRightIcon from "~public/icons/ArrowRight.svg";
import CircleIcon from "~public/icons/Circle.svg";
import EraserIcon from "~public/icons/Eraser.svg";
import LineIcon from "~public/icons/Line.svg";
import PencilIcon from "~public/icons/Pencil.svg";
import SelectionIcon from "~public/icons/Selection.svg";
import SquareIcon from "~public/icons/Square.svg";
import { ToolSettingsTable } from "../ToolSettings/ToolSettingsTable";

const toolListIcons: Record<
  ToolType,
  React.FC<React.SVGProps<SVGSVGElement>> | null
> = {
  rect: SquareIcon,
  pen: PencilIcon,
  text: TextIcon,
  eraser: EraserIcon,
  ellipse: CircleIcon,
  line: LineIcon,
  selection: SelectionIcon,
  polygon: PolygonIcon,
  image: null,
  table: TableIcon
};

export const ToolPicker = (): JSX.Element => {
  const { selectedTool, elements, history } = useAppSelector(
    state => state.canvas
  );
  const settings = useAppSelector(state => state.settings);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [activePopover, setActivePopover] = useState<ToolType | null>(null);
  const { redo, undo, setActiveElement, activeElement } = useActiveElement();

  const onClick = (tool: ToolType) => {
    dispatch(changeTool(tool));
    setActiveElement(null);
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLElement>, tool: ToolType) => {
    if (tool === "selection") return;

    setAnchorEl(anchorEl ? null : e.currentTarget);
    setActivePopover(tool);
  };

  const onContextMenu = (e: React.MouseEvent<HTMLElement>, tool: ToolType) => {
    e.preventDefault();
    if (tool !== "selection") {
      onClick(tool);
      onDoubleClick(e, tool);
    }
  };

  const onClosePopover = () => {
    setAnchorEl(null);
    setActivePopover(null);
  };

  useEffect(() => {}, [settings, anchorEl]);

  return (
    <>
      <ul>
        <li>
          <Tooltip title={"Undo"} placement={"bottom"}>
            <div>
              <Button
                onClick={undo}
                disabled={elements.length === 0 && !activeElement}>
                <ArrowLeftIcon />
              </Button>
            </div>
          </Tooltip>
        </li>
        <li>
          <Tooltip title={"Redo"} placement={"bottom"}>
            <div>
              <Button onClick={redo} disabled={history.length === 0}>
                <ArrowRightIcon />
              </Button>
            </div>
          </Tooltip>
        </li>
      </ul>
      <Separator orientation={"horizontal"} />
      <h3>Tools</h3>
      <ul>
        {ToolList.map((tool, index) => {
          const Icon = toolListIcons[tool];
          if (!Icon) return null;
          return (
            <li key={tool}>
              <Tooltip title={capitalizeFirstLetter(tool)}>
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
              </Tooltip>
            </li>
          );
        })}
      </ul>
      <Popover
        id={anchorEl ? `tool-${activePopover}` : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={onClosePopover}>
        {activePopover === "rect" && <ToolSettingsRect />}
        {activePopover === "pen" && <ToolSettingsPen />}
        {activePopover === "eraser" && <ToolSettingsEraser />}
        {activePopover === "text" && <ToolSettingsText />}
        {activePopover === "ellipse" && <ToolSettingsEllipse />}
        {activePopover === "line" && <ToolSettingsLine />}
        {activePopover === "polygon" && <ToolSettingsPolygon />}
        {activePopover === "table" && <ToolSettingsTable />}
      </Popover>
    </>
  );
};
