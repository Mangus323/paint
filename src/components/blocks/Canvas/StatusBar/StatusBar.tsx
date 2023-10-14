import React, { JSX, useContext, useRef } from "react";
import { MousePositionContext } from "@/components/HOC/MouseListener";
import { ResolutionChanger } from "@/components/blocks/TopPanel/ResolutionChanger/ResolutionChanger";
import { Popover } from "@/components/elements/Popover/Popover";
import { useAsyncValue } from "@/hooks/useAsyncValue";
import useThrottle from "@/hooks/useThrottle";
import { setToast } from "@/redux/slices/browser/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Box, Tooltip } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

export const StatusBar = (): JSX.Element => {
  const { zoom, layerWidth, layerHeight } = useAppSelector(
    state => state.browser
  );
  const { isDrawing } = useAppSelector(state => state.canvas);
  const position = useContext(MousePositionContext);
  const throttlePosition = useThrottle(position, 100);
  const localZoom = useAsyncValue(zoom);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const onClosePopover = () => {
    setAnchorEl(null);
    dispatch(setToast(`Change resolution to ${layerWidth}:${layerHeight}`));
  };

  const onContextMenuResolution = e => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <Box
        sx={{
          fontSize: 12,
          lineHeight: "150%",
          position: "absolute",
          right: 4,
          bottom: 4,
          display: "flex",
          flexDirection: "row-reverse",
          gap: 0.5,
          pointerEvents: isDrawing ? "none" : "unset",
          userSelect: "none"
        }}>
        <Tooltip title={"Canvas resolution"}>
          <Box
            onContextMenu={onContextMenuResolution}
            sx={{
              padding: "2px 4px",
              border: "1px solid var(--black)",
              borderRadius: 1,
              backgroundColor: "var(--teal-100)"
            }}>
            {layerWidth}x{layerHeight}
          </Box>
        </Tooltip>
        <Tooltip title={"Cursor position"}>
          <Box
            component={motion.div}
            sx={{
              padding: "2px 4px",
              border: "1px solid var(--black)",
              borderRadius: 1,
              backgroundColor: "var(--teal-100)"
            }}>
            {throttlePosition.x}:{throttlePosition.y}
          </Box>
        </Tooltip>
        <AnimatePresence>
          {localZoom !== 1 && (
            <Tooltip title={"Zoom"}>
              <Box
                component={motion.div}
                sx={{
                  padding: "2px 4px",
                  border: "1px solid var(--black)",
                  borderRadius: 1,
                  backgroundColor: "var(--teal-100)"
                }}
                exit={{ opacity: 0 }}
                transition={{ delay: 5, duration: 0.2 }}>
                {zoom * 100}%
              </Box>
            </Tooltip>
          )}
        </AnimatePresence>
      </Box>
      <Popover
        ref={popoverRef}
        id={anchorEl ? "resolution-change" : undefined}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={onClosePopover}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}>
        <ResolutionChanger />
      </Popover>
    </>
  );
};
