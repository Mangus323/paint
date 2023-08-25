import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import browserReducer from "./slices/browser/reducer";
import canvasReducer from "./slices/canvas/reducer";
import editActiveElementReducer from "./slices/editActiveElement/reducer";

export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    browser: browserReducer,
    editActiveElement: editActiveElementReducer
  }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
