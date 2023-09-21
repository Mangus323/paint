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
  toast: { value: string; timestamp: number };
}

const initialState: IEditActiveObjectState = {
  activeElementMeta: null,
  isSelecting: false,
  selection: null,
  toast: {
    value: "",
    timestamp: 0
  }
};

export const canvasMetaSlice = createSlice({
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
    startSelecting: (
      state,
      action: PayloadAction<Vector2d & { currentZoom: number }>
    ) => {
      state.isSelecting = true;
      state.selection = {
        ...action.payload,
        width: 0,
        height: 0
      };
    },
    editSelection: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      // @ts-ignore
      state.selection = {
        ...state.selection,
        width: action.payload.width * (state?.selection?.currentZoom || 1),
        height: action.payload.height * (state?.selection?.currentZoom || 1)
      };
    },
    changeSelectionZoom: (state, action: PayloadAction<number>) => {
      if (state.selection) {
        let multiplier = action.payload / state.selection.currentZoom;
        state.selection = {
          x: (state.selection.x - sd.width) * multiplier + sd.width,
          y: (state.selection.y - sd.height) * multiplier + sd.height,
          width: state.selection.width * multiplier,
          height: state.selection.height * multiplier,
          currentZoom: action.payload
        };
      }
    },
    endSelecting: state => {
      state.isSelecting = false;
      if (!state.selection) return;
      state.activeElementMeta = null;
    },
    removeSelection: state => {
      state.isSelecting = false;
      state.selection = null;
    },
    selectAll: (
      state,
      action: PayloadAction<{ width: number; height: number }>
    ) => {
      state.selection = {
        x: sd.width,
        y: sd.height,
        width: action.payload.width,
        height: action.payload.height,
        currentZoom: 1
      };
      state.isSelecting = false;
      state.activeElementMeta = null;
    },
    setToast: (state, action: PayloadAction<string>) => {
      state.toast = { value: action.payload, timestamp: Date.now() };
    }
  }
});

export const {
  changeMeta,
  endSelecting,
  startSelecting,
  editSelection,
  removeSelection,
  selectAll,
  changeSelectionZoom,
  setToast
} = canvasMetaSlice.actions;

export default canvasMetaSlice.reducer;
