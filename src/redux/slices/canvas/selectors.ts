import { RootState, useAppSelector } from "@/redux/store";
import { createSelector } from "reselect";

const getActiveElementSelector = createSelector(
  (state: RootState) => state.canvas,
  canvas => ({
    activeElement: canvas.elements[canvas.elements.length - 1],
    isActiveElement: canvas.isActiveElement
  })
);

export const useActiveElement = () => useAppSelector(getActiveElementSelector);
