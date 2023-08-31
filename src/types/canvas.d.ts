import { ToolList } from "@/types/const";
import Konva from "konva";

import Vector2d = Konva.Vector2d;

interface IBaseElement {
  color?: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface IFigure extends IBaseElement, Vector2d {
  tool: "rect" | "ellipse";
  width: number;
  height: number;
}

export interface IPen extends IBaseElement, Vector2d {
  tool: "pen" | "eraser" | "line";
  points: number[];
}

export interface IText extends IBaseElement, Vector2d {
  tool: "text";
  text: string;
  rotation: number;
}

export interface IArrow extends IBaseElement {
  tool: "arrow";
}

export interface IImage extends IBaseElement, Vector2d {
  tool: "image";
  src: string | ArrayBuffer;
}

export interface ISelection extends IBaseElement {
  tool: "selection";
}

export type IElement = IPen | IFigure | IText | IArrow | IImage | ISelection;

export interface IElementMeta extends Vector2d {
  width: number;
  height: number;
}

export type ToolType = (typeof ToolList)[number];
