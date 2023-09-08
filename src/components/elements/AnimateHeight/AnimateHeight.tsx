import React, { JSX, ReactNode } from "react";
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
        <motion.div
          exit={{ height: 0 }}
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          style={{ overflow: "hidden" }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
