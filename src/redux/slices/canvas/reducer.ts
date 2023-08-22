import { IElement, ToolType } from "@/types/canvas";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CanvasState {
  history: Array<any>;
  selectedTool: ToolType;
  selectedColor: string;
  elements: Array<IElement>;
  activeElement: IElement | null;
  isDrawing: boolean;
  isDownloading: boolean;
}

const initialState: CanvasState = {
  history: [],
  selectedTool: "pen",
  elements: [],
  activeElement: null,
  selectedColor: "#000000",
  isDrawing: false,
  isDownloading: false
};

export const counterSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    placeAndEdit: (state, action: PayloadAction<IElement>) => {
      if ("points" in action.payload) {
        if (action.payload.points.length < 2) return;
      }
      state.isDrawing = action.payload.tool !== "pen";
      state.activeElement = {
        color: state.selectedColor,
        ...action.payload
      };
    },
    edit: (state, action: PayloadAction<Partial<IElement>>) => {
      // @ts-ignore
      state.activeElement = {
        ...state.activeElement,
        ...action.payload
      };
    },
    place: state => {
      if (state.activeElement)
        state.elements.push({
          color: state.selectedColor,
          ...state.activeElement
        });
      state.history = [];
      state.activeElement = null;
    },
    changeTool: (state, action: PayloadAction<ToolType>) => {
      if (state.activeElement) {
        state.elements.push(state.activeElement);
        state.activeElement = null;
      }
      state.selectedTool = action.payload;
    },
    changeColor: (state, action: PayloadAction<string>) => {
      if (state.activeElement) {
        state.activeElement.color = action.payload;
      }
      state.selectedColor = action.payload;
    },
    drag: () => {},
    undo: state => {
      if (state.activeElement) {
        state.activeElement = null;
        return;
      }
      if (state.elements.length) state.history.push(state.elements.pop());
    },
    redo: state => {
      if (state.history.length) state.elements.push(state.history.pop());
    },
    stopDraw: state => {
      state.isDrawing = false;
    },
    setIsDownloading: (state, action: PayloadAction<boolean>) => {
      state.isDownloading = action.payload;
    },
    openFromFile: (state, action: PayloadAction<string | ArrayBuffer>) => {
      state.history = [];
      state.activeElement = null;
      state.elements = [
        {
          src: action.payload,
          tool: "image",
          x: 0,
          y: 0
        }
      ];
    }
  }
});

export const {
  placeAndEdit,
  place,
  edit,
  drag,
  changeColor,
  undo,
  redo,
  changeTool,
  stopDraw,
  setIsDownloading,
  openFromFile
} = counterSlice.actions;

export default counterSlice.reducer;
