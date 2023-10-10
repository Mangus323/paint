import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface BrowserState {
  canvasWidth: number;
  canvasHeight: number;
  layerWidth: number;
  layerHeight: number;
  zoom: number;
  toast: { value: string; timestamp: number };
}

const initialState: BrowserState = {
  canvasWidth: 0,
  canvasHeight: 0,
  layerWidth: 0,
  layerHeight: 0,
  zoom: 1,
  toast: {
    value: "",
    timestamp: 0
  }
};

export const browserSlice = createSlice({
  name: "browser",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Partial<BrowserState>>) => {
      for (const key in action.payload) {
        if (action.payload[key] !== undefined && state[key] !== undefined)
          state[key] = action.payload[key];
      }
    },
    setToast: (state, action: PayloadAction<string>) => {
      state.toast = { value: action.payload, timestamp: Date.now() };
    }
  }
});
export const { set, setToast } = browserSlice.actions;

export default browserSlice.reducer;
