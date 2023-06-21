import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";

import Vector2d = Konva.Vector2d;

export function getPoints(
  e: KonvaEventObject<MouseEvent | TouchEvent>
): Vector2d {
  const stage = e.target.getStage();
  if (stage) {
    let point = stage.getPointerPosition();
    const x = point?.x || -1;
    const y = point?.y || -1;
    return { x, y };
  }
  return { x: -1, y: -1 };
}
