import { IElement, ToolType } from "@/types/canvas";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CanvasState {
  history: Array<any>;
  selectedTool: ToolType;
  selectedColor: string;
  elements: Array<IElement>;
  isActiveElement: boolean;
  isDrawing: boolean;
  isDownloading: boolean;
  isCopying: boolean;
}

const initialState: CanvasState = {
  history: [],
  selectedTool: "pen",
  selectedColor: "#000000",
  elements: [],
  isActiveElement: false,
  isDrawing: false,
  isDownloading: false,
  isCopying: false
};

export const counterSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    placeAndEdit: (state, action: PayloadAction<IElement>) => {
      if ("points" in action.payload) {
        if (action.payload.points.length < 2) return;
      }
      state.isDrawing = true;
      state.isActiveElement = true;
      state.elements.push({
        color: state.selectedColor,
        ...action.payload
      });

      if ("src" in action.payload) {
        state.isDrawing = false;
        state.selectedTool = "image";
      }
    },
    edit: (state, action: PayloadAction<Partial<IElement>>) => {
      // @ts-ignore
      state.elements[state.elements.length - 1] = {
        ...state.elements[state.elements.length - 1],
        ...action.payload
      };
    },
    place: state => {
      state.isActiveElement = false;
      state.history = [];
    },
    changeTool: (state, action: PayloadAction<ToolType>) => {
      state.isActiveElement = false;
      state.selectedTool = action.payload;
    },
    changeColor: (state, action: PayloadAction<string>) => {
      if (state.isActiveElement && state.elements.length)
        state.elements[state.elements.length - 1].color = action.payload;
      state.selectedColor = action.payload;
    },
    undo: state => {
      if (state.elements.length) state.history.push(state.elements.pop());
    },
    redo: state => {
      if (state.history.length) state.elements.push(state.history.pop());
    },
    stopDraw: state => {
      let last = state.elements[state.elements.length - 1];
      if (last && "width" in last && last.width === 0) {
        state.isActiveElement = false;
        state.elements.pop();
      }
      state.isDrawing = false;
    },
    setIsDownloading: (state, action: PayloadAction<boolean>) => {
      state.isDownloading = action.payload;
    },
    setIsCopying: (state, action: PayloadAction<boolean>) => {
      state.isCopying = action.payload;
    },
    openFromFile: (state, action: PayloadAction<string | ArrayBuffer>) => {
      state.history = [];
      state.isActiveElement = false;
      state.elements = [
        {
          src: action.payload,
          tool: "image",
          x: 0,
          y: 0
        }
      ];
    },
    setIsActiveElement: (state, action: PayloadAction<boolean>) => {
      state.isActiveElement = action.payload;
    }
  }
});

export const {
  placeAndEdit,
  place,
  edit,
  changeColor,
  undo,
  redo,
  changeTool,
  stopDraw,
  setIsDownloading,
  openFromFile,
  setIsActiveElement,
  setIsCopying
} = counterSlice.actions;

export default counterSlice.reducer;
