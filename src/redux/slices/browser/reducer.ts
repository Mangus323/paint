import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface BrowserState {
  canvasWidth: number;
  canvasHeight: number;
  layerWidth: number;
  layerHeight: number;
  zoom: number;
}

const initialState: BrowserState = {
  canvasWidth: 0,
  canvasHeight: 0,
  layerWidth: 0,
  layerHeight: 0,
  zoom: 1
};

export const browserSlice = createSlice({
  name: "browser",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Partial<BrowserState>>) => {
      for (const key in action.payload) {
        if (action.payload[key]) state[key] = action.payload[key];
      }
    },
    zoom: (state, action: PayloadAction<number>) => {
      if (action.payload > 0) state.zoom *= 2;
      else state.zoom /= 2;
    }
  }
});
export const { set, zoom } = browserSlice.actions;

export default browserSlice.reducer;
