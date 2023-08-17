import { sidebarDimension } from "@/globals/sidebar";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface BrowserState {
  canvasWidth: number;
  canvasHeight: number;
}

const initialState: BrowserState = {
  canvasWidth: 0,
  canvasHeight: 0
};

export const browserSlice = createSlice({
  name: "browser",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<BrowserState>) => {
      state.canvasHeight =
        action.payload.canvasHeight - sidebarDimension.height;
      state.canvasWidth = action.payload.canvasWidth - sidebarDimension.width;
    }
  }
});
export const { set } = browserSlice.actions;

export default browserSlice.reducer;
