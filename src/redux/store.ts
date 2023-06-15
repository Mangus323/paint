import { configureStore } from "@reduxjs/toolkit";
import browserReducer from "./slices/browser/reducer";
import canvasReducer from "./slices/canvas/reducer";

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    browser: browserReducer
  }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
