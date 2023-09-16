import { IEllipse, ILine, IPen, IRect, IText } from "@/types/canvas";
import { Font } from "@/utils/FontManager";
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
  | "radiusX"
  | "radiusY"
  | keyof Vector2d;

export interface IToolsKeys {
  text: Omit<IText, DefaultOmit | "text">;
  ellipse: Omit<IEllipse, DefaultOmit>;
  eraser: Omit<IPen, DefaultOmit | "points" | "dashEnabled">;
  image: {};
  line: Omit<ILine, DefaultOmit | "points" | "dashEnabled">;
  pen: Omit<IPen, DefaultOmit | "points">;
  rect: Omit<IRect, DefaultOmit>;
  selection: null;
}

interface SettingsState {
  tools: IToolsKeys;
  fonts: Font[];
}

const initialState: SettingsState = {
  tools: {
    text: {
      fontSize: 14,
      fontFamily: "Roboto",
      fontStyle: "",
      textDecoration: ""
    },
    ellipse: { fillType: "fill", strokeWidth: 2, dashEnabled: false },
    eraser: { strokeWidth: 5 },
    image: {},
    line: { strokeWidth: 5, arrowType: "none" },
    pen: { strokeWidth: 5, dashEnabled: false },
    rect: {
      fillType: "fill",
      strokeWidth: 2,
      cornerRadius: 0,
      dashEnabled: false
    },
    selection: null
  },
  fonts: []
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: <T extends keyof IToolsKeys>(
      state,
      action: PayloadAction<{ tool: T; settings: IToolsKeys[T] }>
    ) => {
      const tool = action.payload.tool;
      if (tool === "selection") return;

      state.tools[tool] = {
        ...state.tools[tool],
        ...action.payload.settings
      };
    },
    setFonts: (state, action: PayloadAction<Font[]>) => {
      state.fonts = action.payload;
    }
  }
});

export const { setSettings, setFonts } = settingsSlice.actions;

export default settingsSlice.reducer;
