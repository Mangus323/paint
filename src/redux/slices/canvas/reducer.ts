import { IElement, Tool } from "@/types/canvas";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CanvasState {
  history: Array<any>;
  selectedTool: Tool;
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
    place: (state, action: PayloadAction<Omit<IElement, "tool" | "color">>) => {
      state.elements.push({
        ...action.payload,
        tool: state.selectedTool,
        color: state.selectedColor
      });
    },
    drag: () => {},
    undo: () => {},
    redo: () => {}
  }
});

export const { place, drag, undo, redo } = counterSlice.actions;

export default counterSlice.reducer;
