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
      }
    },
    place: (state, action: PayloadAction<IElement>) => {
      state.elements.push(action.payload);
      state.history = [];
    },
    changeTool: (state, action: PayloadAction<ToolType>) => {
      // state.isActiveElement = false;
      state.selectedTool = action.payload;
    },
    undo: state => {
      // if (!state.isActiveElement && state.elements.length) {
      //   state.isActiveElement = true;
      //   return;
      // }
      // state.isActiveElement = state.elements.length > 1;
      if (state.elements.length) {
        const last = state.elements.pop();
        if (last) state.history.push(last);
      }
    },
    redo: state => {
      if (state.history.length) {
        const last = state.history.pop();
        if (last) {
          state.elements.push(last);
          // state.isActiveElement = true;
        }
      }
    },
    stopDraw: state => {
      let last = state.elements[state.elements.length - 1];
      if (last && "width" in last && last.width === 0) {
        // state.isActiveElement = false;
        state.elements.pop();
      }
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
    duplicate: state => {
      // if (!state.isActiveElement) return;
      state.elements.push(state.elements[state.elements.length - 1]);
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
