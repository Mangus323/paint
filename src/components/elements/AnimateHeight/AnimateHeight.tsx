import React, { JSX, ReactNode } from "react";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

interface AnimateHeightProps {
  open: boolean;
  children: ReactNode;
}

export const AnimateHeight = (props: AnimateHeightProps): JSX.Element => {
  const { open, children } = props;
  return (
    <AnimatePresence initial={false}>
      {open && (
        <Box
          component={motion.div}
          exit={{ height: 0 }}
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          sx={{
            overflow: "visible",
            overflowY: "hidden",
            overflowX: "visible"
          }}>
          {children}
        </Box>
      )}
    </AnimatePresence>
  );
};
