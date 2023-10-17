import { IEllipse, ILine, IPen, IPolygon, IRect, IText } from "@/types/canvas";
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
  polygon: Omit<IPolygon, DefaultOmit>;
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
  selectedColor: string;
  colorList: string[];
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
    polygon: {
      fillType: "fill",
      strokeWidth: 2,
      sides: 3,
      dashEnabled: false
    },
    selection: null
  },
  fonts: [],
  selectedColor: "#000000",
  colorList: []
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
    },
    setColor: (state, action: PayloadAction<string>) => {
      state.selectedColor = action.payload;
    },
    addNewColor: (state, action: PayloadAction<string>) => {
      state.colorList.push(action.payload);
    },
    removeColor: (state, action: PayloadAction<number>) => {
      state.colorList.splice(action.payload, 1);
    }
  }
});

export const { setSettings, setFonts, setColor, addNewColor, removeColor } =
  settingsSlice.actions;

export default settingsSlice.reducer;
