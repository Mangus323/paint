import { sp } from "@/globals/globals";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import Konva from "konva";

import Vector2d = Konva.Vector2d;

export interface BrowserState {
  canvasWidth: number;
  canvasHeight: number;
  layerWidth: number;
  layerHeight: number;
  zoom: number;
  verticalBar: Vector2d;
  horizontalBar: Vector2d;
  layerX: number;
  layerY: number;
}

const initialState: BrowserState = {
  canvasWidth: 0,
  canvasHeight: 0,
  layerWidth: 0,
  layerHeight: 0,
  zoom: 1,
  verticalBar: { x: 0, y: 0 },
  horizontalBar: { x: 0, y: 0 },
  layerX: 0,
  layerY: 0
};

export const browserSlice = createSlice({
  name: "browser",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Partial<BrowserState>>) => {
      for (const key in action.payload) {
        if (action.payload[key] !== undefined) state[key] = action.payload[key];
      }
    },
    zoom: (state, action: PayloadAction<number>) => {
      let nextZoom = state.zoom;
      if (action.payload > 0) nextZoom *= 2;
      else nextZoom /= 2;
      state.zoom = nextZoom;

      const {
        layerY,
        layerX,
        canvasHeight,
        verticalBar,
        canvasWidth,
        horizontalBar,
        layerHeight,
        layerWidth
      } = state;

      const innerWidth = layerWidth * nextZoom;
      const availableWidth = canvasWidth - sp * 2 - 100;
      const nextLayerX = Math.max(
        layerX,
        canvasWidth > innerWidth ? 0 : canvasWidth - innerWidth
      );
      if (nextLayerX !== layerX) {
        state.layerX = nextLayerX;
        state.horizontalBar.x = Math.min(
          horizontalBar.x,
          layerWidth * nextZoom
        );
      }
      state.horizontalBar.x =
        (nextLayerX / (canvasWidth - innerWidth)) * availableWidth + sp;
      // copy for Y
      const innerHeight = layerHeight * nextZoom;
      const availableHeight = canvasHeight - sp * 2 - 100;
      const nextLayerY = Math.max(
        layerY,
        canvasHeight > innerHeight ? 0 : canvasHeight - innerHeight
      );
      if (nextLayerY !== layerY) {
        state.layerY = nextLayerY;
        state.verticalBar.y = Math.min(verticalBar.y, layerHeight * nextZoom);
      }
      state.verticalBar.y =
        (nextLayerY / (canvasHeight - innerHeight)) * availableHeight + sp;
    }
  }
});
export const { set, zoom } = browserSlice.actions;

export default browserSlice.reducer;
