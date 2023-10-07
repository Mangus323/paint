import React, { JSX, useEffect, useState } from "react";
import { sidebarDimension } from "@/globals/globals";
import { setToast } from "@/redux/slices/browser/reducer";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { Box, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

export const Toaster = (): JSX.Element => {
  const { toast } = useAppSelector(state => state.browser);
  const dispatch = useAppDispatch();
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(
    null
  );

  useEffect(() => {
    if (!toast.value) return;
    if (timer) clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        dispatch(setToast(""));
      }, 1000)
    );

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [toast]);

  return (
    <Box
      sx={{
        position: "absolute",
        top: sidebarDimension.height + 2,
        left: "50%",
        display: "flex",
        justifyContent: "center",
        userSelect: "none",
        pointerEvent: "none"
      }}>
      <AnimatePresence>
        {toast.value && (
          <Box
            component={motion.div}
            exit={{ opacity: 0 }}
            sx={{
              transform: "translateX(-50%)",
              border: "1px solid var(--black)",
              padding: "2px 4px",
              minWidth: 60,
              borderRadius: 1,
              textAlign: "center"
            }}>
            <Typography component={"p"} sx={{ fontSize: 14 }}>
              {capitalizeFirstLetter(toast.value)}
            </Typography>
          </Box>
        )}
      </AnimatePresence>
    </Box>
  );
};
