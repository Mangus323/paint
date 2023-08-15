import { IElement, ToolType } from "@/types/canvas";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CanvasState {
  history: Array<any>;
  selectedTool: ToolType;
  selectedColor: string;
  elements: Array<IElement>;
  isActiveElement: boolean;
  activeElement: IElement | null;
}

const initialState: CanvasState = {
  history: [],
  selectedTool: "pen",
  elements: [],
  activeElement: null,
  selectedColor: "#000000",
  isActiveElement: false
};

export const counterSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    placeAndEdit: (state, action: PayloadAction<IElement>) => {
      state.activeElement = {
        color: state.selectedColor,
        ...action.payload
      };
      state.isActiveElement = true;
    },
    edit: (state, action: PayloadAction<Partial<IElement>>) => {
      if (state.isActiveElement) {
        // @ts-ignore
        state.activeElement = {
          ...state.activeElement,
          ...action.payload
        };
      }
    },
    place: (state, action: PayloadAction<IElement>) => {
      if ("points" in action.payload) {
        if (action.payload.points.length < 2) return;
      }
      state.elements.push({
        color: state.selectedColor,
        ...action.payload
      });
      state.history = [];
      state.isActiveElement = false;
      state.activeElement = null;
    },
    changeTool: (state, action: PayloadAction<ToolType>) => {
      if (state.isActiveElement) {
        if (state.activeElement) state.elements.push(state.activeElement);
        state.activeElement = null;
        state.isActiveElement = false;
      }
      state.selectedTool = action.payload;
    },
    changeColor: (state, action: PayloadAction<string>) => {
      if (state.isActiveElement) {
        if (state.activeElement) state.elements.push(state.activeElement);
        state.activeElement = null;
        state.isActiveElement = false;
      }
      state.isActiveElement = false;
      state.selectedColor = action.payload;
    },
    drag: () => {},
    undo: state => {
      if (state.isActiveElement) {
        state.activeElement = null;
        state.isActiveElement = false;
        return;
      }
      if (state.elements.length) state.history.push(state.elements.pop());
    },
    redo: state => {
      state.isActiveElement = false;
      if (state.history.length) state.elements.push(state.history.pop());
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
  changeTool
} = counterSlice.actions;

export default counterSlice.reducer;
