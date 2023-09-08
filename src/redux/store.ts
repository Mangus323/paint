import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import browserReducer from "./slices/browser/reducer";
import canvasReducer from "./slices/canvas/reducer";
import canvasMetaReducer from "./slices/canvasMeta/reducer";
import settingsReducer from "./slices/settings/reducer";

const persistConfig = {
  key: "settings",
  storage: storage,
  whitelist: []
  // whitelist: ["settings"]
};

const rootReducers = combineReducers({
  canvas: canvasReducer,
  browser: browserReducer,
  canvasMeta: canvasMetaReducer,
  settings: settingsReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
      }
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;
