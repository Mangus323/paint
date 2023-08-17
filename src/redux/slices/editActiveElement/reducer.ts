import { IElementMeta } from "@/types/canvas";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface IEditActiveObjectState {
  activeElementMeta: IElementMeta | null;
}

const initialState: IEditActiveObjectState = {
  activeElementMeta: null
};

export const counterSlice = createSlice({
  name: "editActiveElement",
  initialState,
  reducers: {
    changeMeta: (state, action: PayloadAction<Partial<IElementMeta>>) => {
      if (state.activeElementMeta) {
        // @ts-ignore
        state.activeElementMeta = {
          ...state.activeElementMeta,
          ...action.payload
        };
      } else {
        // @ts-ignore
        state.activeElementMeta = action.payload;
      }
    }
  }
});

export const { changeMeta } = counterSlice.actions;

export default counterSlice.reducer;
