import { RootState } from "@/redux/store";
import { ToolType } from "@/types/canvas";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const getSettingsSelector = createSelector(
  [(state: RootState) => state.settings, (state, tool) => tool],
  (settings, tool) => ({
    ...settings.tools[tool],
    color: settings.selectedColor
  })
);

export const useSettings = (tool: ToolType) =>
  useSelector(state => getSettingsSelector(state, tool));
