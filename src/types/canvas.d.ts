import { ToolList } from "@/types/const";
import Konva from "konva";

import Vector2d = Konva.Vector2d;

interface IBaseElement {
  color?: string;
  rotation?: number;
}

export interface IFigure extends IBaseElement, Vector2d {
  tool: "rect" | "ellipse";
  width: number;
  height: number;
}

export interface IPen extends IBaseElement {
  tool: "pen" | "eraser";
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

export interface IImage extends IBaseElement {
  tool: "image";
  src: string | ArrayBuffer;
  x: number;
  y: number;
}

export type IElement = IPen | IFigure | IText | IArrow | IImage;

export interface IElementMeta {
  width: number;
  height: number;
  x: number;
  y: number;
}

export type ToolType = (typeof ToolList)[number];
