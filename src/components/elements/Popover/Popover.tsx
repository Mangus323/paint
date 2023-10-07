import React, { JSX, ReactNode } from "react";
import {
  Box,
  Popover as MuiPopover,
  PopoverProps as MuiPopoverProps,
  useTheme
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

interface PopoverProps extends MuiPopoverProps {
  children?: ReactNode | ReactNode[];
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (props, ref): JSX.Element => {
    const { children, ...popoverProps } = props;
    const theme = useTheme();

    let isChildren =
      children instanceof Array ? children.some(child => !!child) : !!children;

    return (
      <MuiPopover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        {...popoverProps}
        ref={ref}>
        <AnimatePresence>
          {isChildren && (
            <Box
              component={motion.div}
              exit={{ opacity: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              sx={{
                minWidth: "12rem",
                p: "0.25rem 0",
                color: theme.palette.primary.contrastText,
                "& > *": {
                  px: "1rem"
                }
              }}>
              {props.children}
            </Box>
          )}
        </AnimatePresence>
      </MuiPopover>
    );
  }
);

Popover.displayName = "Popover";
