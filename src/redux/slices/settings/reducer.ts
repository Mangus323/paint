import { IFigure } from "@/types/canvas";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type DefaultOmit = "tool" | "width" | "height" | "x" | "y";

interface ToolsKeys {
  text: {};
  ellipse: {};
  eraser: {};
  image: {};
  line: {};
  pen: {};
  rect: Omit<IFigure, DefaultOmit>;
  selection: null;
}

export interface SettingsState {
  tools: ToolsKeys;
}

const initialState: SettingsState = {
  tools: {
    text: {},
    ellipse: {},
    eraser: {},
    image: {},
    line: {},
    pen: {},
    rect: { fillType: "fill", strokeWidth: 2, cornerRadius: 0 },
    selection: null
  }
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: <T extends keyof ToolsKeys>(
      state,
      action: PayloadAction<{ tool: T; settings: ToolsKeys[T] }>
    ) => {
      const tool = action.payload.tool;
      if (tool === "selection") return;

      state.tools[tool] = {
        ...state.tools[tool],
        ...action.payload.settings
      };
    }
  }
});

export const { setSettings } = settingsSlice.actions;

export default settingsSlice.reducer;
