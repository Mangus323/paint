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
  // save file
  dataURL: null | string;
  dataURLPreview: null | string;
  imageScale: number;
}

const initialState: IEditActiveObjectState = {
  activeElementMeta: null,
  isSelecting: false,
  selection: null,
  dataURL: null,
  dataURLPreview: null,
  imageScale: 1
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
    setDataURL: (state, action: PayloadAction<string>) => {
      state.dataURL = action.payload;
    },
    setDataURLPreview: (state, action: PayloadAction<string>) => {
      state.dataURLPreview = action.payload;
    },
    disposeDataURLS: state => {
      state.dataURL = null;
      state.dataURLPreview = null;
    },
    setImageScale: (state, action: PayloadAction<number>) => {
      state.imageScale = action.payload;
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
  setDataURL,
  setDataURLPreview,
  disposeDataURLS,
  setImageScale
} = canvasMetaSlice.actions;

export default canvasMetaSlice.reducer;
