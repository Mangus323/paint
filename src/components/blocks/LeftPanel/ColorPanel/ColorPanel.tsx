import React, { JSX, useRef } from "react";
import { ColorPicker } from "@/components/blocks/LeftPanel/ColorPicker/ColorPicker";
import { Button } from "@/components/elements/Button/Button";
import { Popover } from "@/components/elements/Popover/Popover";
import { Separator } from "@/components/elements/Separator/Separator";
import { defaultColors } from "@/globals/globals";
import { useActiveElement } from "@/hooks/useActiveElement";
import { setToast } from "@/redux/slices/browser/reducer";
import {
  addNewColor,
  removeColor,
  setColor
} from "@/redux/slices/settings/reducer";
import { AppDispatch, useAppDispatch, useAppSelector } from "@/redux/store";
import { Box, Tooltip, Typography } from "@mui/material";
import { motion } from "framer-motion";
import MarkXIcon from "~public/icons/MarkX.svg";

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

    if (colorList.length >= 20) {
      dispatch(setToast(`Set color ${selectedColor}`));
      return;
    }

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

  const onDeleteCustom = (index: number) => {
    dispatch(removeColor(index));
  };

  return (
    <>
      <h3>Color</h3>
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
          <Typography sx={{ lineHeight: 1 }}>
            custom{"\n"}
            {colorList.length} / 20
          </Typography>
          <ul>
            {colorList.map((color, index) => {
              return (
                <ColorListItem
                  key={color}
                  color={color}
                  onSetColor={onSetColor}
                  onDelete={() => {
                    onDeleteCustom(index);
                  }}
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

interface ColorListItemProps {
  color: string;
  onSetColor: (color: string) => void;
  onDelete?: () => void;
}

const ColorListItem = (props: ColorListItemProps): JSX.Element => {
  const { color, onSetColor, onDelete } = props;
  const dispatch = useAppDispatch();

  const onContextMenu = async () => {
    await navigator.clipboard.writeText(color);
    dispatch(setToast(`Copied color ${color}`));
  };

  const variants = onDelete
    ? {
        initial: {
          opacity: 0,
          scale: 0
        },
        animate: {
          opacity: 1,
          scale: 1,
          transition: {
            delay: 0.5
          }
        }
      }
    : undefined;

  return (
    <li>
      <Tooltip title={color}>
        <Box
          component={motion.div}
          whileHover={"animate"}
          initial="initial"
          animate="initial"
          sx={{
            position: "relative"
          }}>
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
          {onDelete && (
            <Box
              component={motion.div}
              onClick={onDelete}
              sx={{
                position: "absolute",
                top: -6,
                right: 0,
                fontSize: 8,
                height: "8px"
              }}
              variants={variants}>
              <MarkXIcon />
            </Box>
          )}
        </Box>
      </Tooltip>
    </li>
  );
};
