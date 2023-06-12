import { configureStore } from "@reduxjs/toolkit";
import browserReducer from "./slices/browser/reducer";
import counterReducer from "./slices/paint/reducer";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    browser: browserReducer
  }
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
