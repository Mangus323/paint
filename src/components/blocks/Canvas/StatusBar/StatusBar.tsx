import React, { JSX } from "react";
import { useAsyncValue } from "@/hooks/useAsyncValue";
import { useAppSelector } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import s from "./index.module.scss";

export const StatusBar = (): JSX.Element => {
  const { zoom } = useAppSelector(state => state.browser);
  const localZoom = useAsyncValue(zoom);

  return (
    <div className={s.container}>
      <AnimatePresence>
        {localZoom !== 1 && (
          <motion.div
            className={s.item}
            exit={{ opacity: 0 }}
            transition={{ delay: 5, duration: 0.2 }}>
            {zoom * 100}%
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
