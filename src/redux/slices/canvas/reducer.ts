import { IElement, ToolType } from "@/types/canvas";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CanvasState {
  history: Array<IElement>;
  selectedTool: ToolType;
  elements: Array<IElement>;
  isDrawing: boolean;
  isDownloading: boolean;
  isCopying: boolean;
}

const initialState: CanvasState = {
  history: [],
  selectedTool: "pen",
  elements: [],
  isDrawing: false,
  isDownloading: false,
  isCopying: false
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    placeAndEdit: (state, action: PayloadAction<IElement>) => {
      state.isDrawing = true;
      if ("src" in action.payload) {
        state.isDrawing = false;
        state.selectedTool = "image";
      }
      if ("text" in action.payload) {
        state.isDrawing = false;
        state.selectedTool = "text";
      }
      state.history = [];
    },
    place: (state, action: PayloadAction<IElement>) => {
      state.elements.push(action.payload);
    },
    changeTool: (state, action: PayloadAction<ToolType>) => {
      state.selectedTool = action.payload;
    },
    undo: (state, action: PayloadAction<IElement | null>) => {
      if (action.payload) {
        state.history.push(action.payload);
        state.elements.pop();
      } else if (state.elements.length) {
        const last = state.elements.pop();
        if (last) state.history.push(last);
        else if (action.payload) state.history.push(action.payload);
      }
    },
    redo: state => {
      state.history.pop();
    },
    stopDraw: state => {
      state.isDrawing = false;
    },
    startDraw: state => {
      state.isDrawing = true;
    },
    setIsDownloading: (state, action: PayloadAction<boolean>) => {
      state.isDownloading = action.payload;
    },
    setIsCopying: (state, action: PayloadAction<boolean>) => {
      state.isCopying = action.payload;
    },
    openFromFile: (state, action: PayloadAction<string | ArrayBuffer>) => {
      state.history = [];
      // state.isActiveElement = false;
      state.elements = [
        {
          src: action.payload,
          tool: "image",
          x: 0,
          y: 0
        }
      ];
    },
    duplicate: (state, action: PayloadAction<IElement | null>) => {
      if (!action.payload) return;
      state.elements.push(action.payload);
    }
  }
});

export const {
  placeAndEdit,
  place,
  undo,
  redo,
  changeTool,
  stopDraw,
  startDraw,
  setIsDownloading,
  openFromFile,
  duplicate,
  setIsCopying
} = canvasSlice.actions;

export default canvasSlice.reducer;
