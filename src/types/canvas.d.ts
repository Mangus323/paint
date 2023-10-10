import { ToolList } from "@/types/const";
import Konva from "konva";

import Vector2d = Konva.Vector2d;

interface IBaseElement {
  color?: string;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  offsetX?: number;
  offsetY?: number;
}

export interface IFigure extends IBaseElement, Vector2d {
  tool: "rect" | "ellipse";
  width: number;
  height: number;
  fillType: "outline" | "fill";
  strokeWidth: number;
  startX: number;
  startY: number;
  dashEnabled: boolean;
}

export interface IRect extends IFigure {
  tool: "rect";
  cornerRadius: number;
}

export interface IEllipse extends IFigure {
  tool: "ellipse";
  radiusX: number;
  radiusY: number;
}

export interface IPen extends IBaseElement, Vector2d {
  tool: "pen" | "eraser";
  points: number[];
  strokeWidth: number;
  dashEnabled: boolean;
}

export interface ILine extends IPen {
  tool: "line";
  arrowType: "none" | "triangle" | "circle" | "line";
}

export interface IText extends IBaseElement, Vector2d {
  tool: "text";
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  textDecoration: string;
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

export type IElement =
  | IPen
  | IEllipse
  | IText
  | IArrow
  | IImage
  | ISelection
  | IRect
  | ILine;

export interface IElementMeta extends Vector2d {
  width: number;
  height: number;
  currentZoom: number;
}

export type ToolType = (typeof ToolList)[number];

export interface IScroll {
  verticalBar: Vector2d;
  horizontalBar: Vector2d;
  layerX: number;
  layerY: number;
}
