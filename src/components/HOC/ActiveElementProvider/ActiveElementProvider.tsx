import React, { JSX, createContext, useState } from "react";
import { IElement } from "@/types/canvas";

interface IActiveElementContext {
  element: null | IElement;
  setElement: (element: IElement | null) => void;
}

interface ActiveElementProviderProps {
  children: React.ReactNode;
}

export const ActiveElementContext = createContext<IActiveElementContext>({
  element: null,
  setElement: () => {}
});

export const ActiveElementProvider = ({
  children
}: ActiveElementProviderProps): JSX.Element => {
  const [activeElement, setActiveElement] = useState<IElement | null>(null);

  return (
    <ActiveElementContext.Provider
      value={{ element: activeElement, setElement: setActiveElement }}>
      {children}
    </ActiveElementContext.Provider>
  );
};
