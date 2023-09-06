import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import Vector2d = Konva.Vector2d;

export function getPoints(
  e: KonvaEventObject<MouseEvent | TouchEvent>,
  zoom: number,
  offset: Vector2d
): Vector2d {
  const stage = e.target.getStage();
  if (!stage) return { x: 0, y: 0 };
  let point = stage.getPointerPosition();
  const x = ((point?.x || 0) - offset.x) / zoom;
  const y = ((point?.y || 0) - offset.y) / zoom;
  return { x, y };
}
