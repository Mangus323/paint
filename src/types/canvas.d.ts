import { ToolList } from "@/types/const";
import Konva from "konva";

import Vector2d = Konva.Vector2d;

interface IBaseElement {
  color?: string;
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
}

export interface IArrow extends IBaseElement {
  tool: "arrow";
}

export type IElement = IPen | IFigure | IText | IArrow;

export type ToolType = (typeof ToolList)[number];
