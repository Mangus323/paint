import { IFigure, IPen } from "@/types/canvas";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import Konva from "konva";

import Vector2d = Konva.Vector2d;

type DefaultOmit =
  | "tool"
  | "width"
  | "height"
  | "startX"
  | "startY"
  | keyof Vector2d;

interface ToolsKeys {
  text: {};
  ellipse: {};
  eraser: {};
  image: {};
  line: {};
  pen: Omit<IPen, DefaultOmit | "points">;
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
    pen: { strokeWidth: 5, dashEnabled: false },
    rect: {
      fillType: "fill",
      strokeWidth: 2,
      cornerRadius: 0,
      dashEnabled: false
    },
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
