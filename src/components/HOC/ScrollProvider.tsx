import React, { JSX, createContext, useState } from "react";
import { IScroll } from "@/types/canvas";

interface IScrollContext {
  scroll: IScroll;
  setScroll: (scroll: Partial<IScroll>) => void;
}

interface ScrollProviderProps {
  children: React.ReactNode;
}

export const ScrollContext = createContext<IScrollContext>({
  scroll: {
    verticalBar: { x: 0, y: 0 },
    horizontalBar: { x: 0, y: 0 },
    layerX: 0,
    layerY: 0
  },
  setScroll: () => {}
});

export const ScrollProvider = ({
  children
}: ScrollProviderProps): JSX.Element => {
  const [scroll, setScroll] = useState<IScroll>({
    verticalBar: { x: 0, y: 0 },
    horizontalBar: { x: 0, y: 0 },
    layerX: 0,
    layerY: 0
  });

  const setNewScroll = (newScroll: Partial<IScroll>) => {
    setScroll({ ...scroll, ...newScroll });
  };

  return (
    <ScrollContext.Provider value={{ scroll, setScroll: setNewScroll }}>
      {children}
    </ScrollContext.Provider>
  );
};
