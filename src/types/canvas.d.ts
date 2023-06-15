export interface IElement {
  x: number;
  y: number;
  width: number;
  height: number;
  tool: Tool;
  color: string;
}

type Tool = "arrow" | "rect" | "pen" | "text" | "eraser" | "circle";
