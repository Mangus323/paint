import React, { JSX, ReactNode } from "react";
import {
  Popover as MuiPopover,
  PopoverProps as MuiPopoverProps
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import s from "./index.module.scss";

interface PopoverProps extends MuiPopoverProps {
  children?: ReactNode;
}

export const Popover = (props: PopoverProps): JSX.Element => {
  const { children, ...popoverProps } = props;

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
      {...popoverProps}>
      <AnimatePresence>
        {children && (
          <motion.div
            className={s.container}
            exit={{ opacity: 0 }}
            transition={{ delay: 0, duration: 0.5 }}
            layout={"position"}>
            {props.children}
          </motion.div>
        )}
      </AnimatePresence>
    </MuiPopover>
  );
};
