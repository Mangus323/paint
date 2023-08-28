import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const getActiveElementSelector = createSelector(
  (state: RootState) => state.canvas,
  canvas => ({
    activeElement: canvas.elements[canvas.elements.length - 1] || null,
    isActiveElement: canvas.isActiveElement || false
  })
);

export const useActiveElement = () => useSelector(getActiveElementSelector);
