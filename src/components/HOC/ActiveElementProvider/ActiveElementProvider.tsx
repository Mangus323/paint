import React, { JSX, createContext, useEffect, useState } from "react";
import usePrevious from "@/hooks/usePrevious";
import { place, placeAndEdit } from "@/redux/slices/canvas/reducer";
import { useAppDispatch } from "@/redux/store";
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
  const previous = usePrevious<typeof activeElement>(activeElement);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (previous === null) {
      dispatch(placeAndEdit(activeElement as IElement));
    }
    if (previous && activeElement === null) {
      dispatch(place(previous));
    }
  }, [activeElement]);

  return (
    <ActiveElementContext.Provider
      value={{ element: activeElement, setElement: setActiveElement }}>
      {children}
    </ActiveElementContext.Provider>
  );
};
