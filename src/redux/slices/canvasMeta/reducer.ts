import { sidebarDimension as sd } from "@/globals/globals";
import { IElementMeta } from "@/types/canvas";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import Konva from "konva";

import Vector2d = Konva.Vector2d;

export interface IEditActiveObjectState {
  activeElementMeta: IElementMeta | null;
  isSelecting: boolean;
  selection: IElementMeta | null;
}

const initialState: IEditActiveObjectState = {
  activeElementMeta: null,
  isSelecting: false,
  selection: null
};

export const counterSlice = createSlice({
  name: "canvasMeta",
  initialState,
  reducers: {
    changeMeta: (state, action: PayloadAction<Partial<IElementMeta>>) => {
      state.selection = null;
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
    },
    startSelecting: (state, action: PayloadAction<Vector2d>) => {
      state.isSelecting = true;
      state.selection = {
        ...action.payload,
        width: 0,
        height: 0
      };
    },
    editSelect: (state, action: PayloadAction<Partial<IElementMeta>>) => {
      // @ts-ignore
      state.selection = { ...state.selection, ...action.payload };
    },
    endSelecting: state => {
      state.isSelecting = false;
      if (!state.selection) return;
      state.activeElementMeta = null;
    },
    selectAll: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.selection = {
        x: sd.width,
        y: sd.height,
        width: action.payload.width,
        height: action.payload.height
      };
      state.isSelecting = false;
      state.activeElementMeta = null;
    }
  }
});

export const {
  changeMeta,
  endSelecting,
  startSelecting,
  editSelect,
  selectAll
} = counterSlice.actions;

export default counterSlice.reducer;
