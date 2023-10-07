import React, { JSX, useRef } from "react";
import { ColorPicker } from "@/components/blocks/LeftPanel/ColorPicker/ColorPicker";
import { Button } from "@/components/elements/Button/Button";
import { Popover } from "@/components/elements/Popover/Popover";
import { Separator } from "@/components/elements/Separator/Separator";
import { defaultColors } from "@/globals/globals";
import { useActiveElement } from "@/hooks/useActiveElement";
import { setToast } from "@/redux/slices/browser/reducer";
import { addNewColor, setColor } from "@/redux/slices/settings/reducer";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/redux/store";
import { Box, Tooltip } from "@mui/material";

export const ColorPanel = (): JSX.Element => {
  const { selectedColor, colorList } = useAppSelector(state => state.settings);
  const dispatch: AppDispatch = useAppDispatch();
  const { activeElement, setActiveElement } = useActiveElement();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const onClosePopover = () => {
    setAnchorEl(null);
    if (defaultColors.includes(selectedColor)) return;
    if (colorList.includes(selectedColor)) return;
    dispatch(addNewColor(selectedColor));
    dispatch(setToast(`Added new color ${selectedColor}`));
  };

  const onSetColor = (color: string) => {
    dispatch(setColor(color));
    if (activeElement)
      setActiveElement({
        ...activeElement,
        color: color
      });
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const onContextMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onDoubleClick(e);
  };

  return (
    <>
      <h3>Colors</h3>
      <Tooltip title={`Current: ${selectedColor}`}>
        <Box
          component={"button"}
          sx={{
            width: "100%",
            marginBottom: "2px",
            aspectRatio: 1
          }}
          style={{ backgroundColor: selectedColor }}
          onDoubleClick={onDoubleClick}
          onContextMenu={onContextMenu}
          aria-describedby={anchorEl ? "color-picker" : undefined}
        />
      </Tooltip>
      <ul>
        {defaultColors.map(color => {
          return (
            <ColorListItem key={color} color={color} onSetColor={onSetColor} />
          );
        })}
      </ul>
      {colorList.length !== 0 && (
        <>
          <Separator orientation={"horizontal"} />
          <ul>
            {colorList.map(color => {
              return (
                <ColorListItem
                  key={color}
                  color={color}
                  onSetColor={onSetColor}
                />
              );
            })}
          </ul>
        </>
      )}
      <Popover
        ref={popoverRef}
        id={anchorEl ? "color-picker" : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={onClosePopover}>
        <ColorPicker onSetColor={onSetColor} />
      </Popover>
    </>
  );
};

const ColorListItem = ({ color, onSetColor }) => {
  const dispatch = useAppDispatch();

  const onContextMenu = async () => {
    await navigator.clipboard.writeText(color);
    dispatch(setToast(`Copied color ${color}`));
  };

  return (
    <li>
      <Tooltip title={color}>
        <div>
          <Button
            onClick={() => onSetColor(color)}
            onContextMenu={onContextMenu}
            hoverEffects>
            <Box
              sx={{
                width: "100%",
                aspectRatio: 1
              }}
              style={{ backgroundColor: color }}
            />
          </Button>
        </div>
      </Tooltip>
    </li>
  );
};
