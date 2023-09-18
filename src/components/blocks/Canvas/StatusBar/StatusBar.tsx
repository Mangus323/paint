import React, { JSX } from "react";
import { useAsyncValue } from "@/hooks/useAsyncValue";
import { useAppSelector } from "@/redux/store";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

export const StatusBar = (): JSX.Element => {
  const { zoom } = useAppSelector(state => state.browser);
  const localZoom = useAsyncValue(zoom);

  return (
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
        pointerEvents: "none",
        userSelect: "none"
      }}>
      <AnimatePresence>
        {localZoom !== 1 && (
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
        )}
      </AnimatePresence>
    </Box>
  );
};
