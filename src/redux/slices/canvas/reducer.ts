import { IElement, ToolType } from "@/types/canvas";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CanvasState {
  history: Array<any>;
  selectedTool: ToolType;
  selectedColor: string;
  elements: Array<IElement>;
}

const initialState: CanvasState = {
  history: [],
  selectedTool: "arrow",
  elements: [],
  selectedColor: "#123123"
};

export const counterSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    place: (state, action: PayloadAction<IElement>) => {
      if ("points" in action.payload) {
        if (action.payload.points.length < 2) return;
      }

      state.elements.push({
        color: state.selectedColor,
        ...action.payload
      });
      state.history = [];
    },
    changeTool: (state, action: PayloadAction<ToolType>) => {
      state.selectedTool = action.payload;
    },
    changeColor: (state, action: PayloadAction<string>) => {
      state.selectedColor = action.payload;
    },
    drag: () => {},
    undo: state => {
      if (state.elements.length) state.history.push(state.elements.pop());
    },
    redo: state => {
      if (state.history.length) state.elements.push(state.history.pop());
    }
  }
});

export const { place, drag, changeColor, undo, redo, changeTool } =
  counterSlice.actions;

export default counterSlice.reducer;
