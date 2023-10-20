import { sp } from "@/globals/globals";
import { BrowserState } from "@/redux/slices/browser/reducer";
import { IScroll } from "@/types/canvas";

const degreeToRadian = (deg: number) => (Math.PI * deg) / 180;

// Finds the angle between 2 points with respect to the x-axis
export const twoPointsToDegree = (points: number[]) => {
  let [x1, y1, x2, y2] = points;
  let result = (180 / Math.PI) * Math.atan2(y2 - y1, x2 - x1) + 90;

  return result < 0 ? result + 360 : result;
};
// Returns the closest angle of side
export const getSmoothAngle = (angle: number, sides: number) => {
  const sideDegrees = 360 / sides;
  return (~~(angle / sideDegrees) * 360) / sides;
};

// Returns the closest angle between 2 points, which located on 1 side
export const twoPointsToDegreeSmooth = (points: number[], sides: number) => {
  const originalAngle = twoPointsToDegree(points);
  const sideDegrees = 360 / sides;
  const sideAngle = originalAngle % sideDegrees;
  const smoothAngle = getSmoothAngle(originalAngle, sides);

  if (sideAngle > sideDegrees / 2) {
    return smoothAngle + sideDegrees;
  }
  return smoothAngle;
};

// Returns the point of a circle with center on a point, when rotated by an angle
const getSecondPoint = (point: number[], angle: number, length: number) => {
  angle -= 90;
  const x = point[0] + length * Math.cos(degreeToRadian(angle));
  const y = point[1] + length * Math.sin(degreeToRadian(angle));
  return [x, y];
};

// Rotates the line to one side
export const twoPointsToSmoothPoints = (points: number[], sides: number) => {
  const length = getTwoPointsLength(points);
  const angle = twoPointsToDegreeSmooth(points, sides);

  return [points[0], points[1], ...getSecondPoint(points, angle, length)];
};

// Return distance between two points;
const getTwoPointsLength = (points: number[]) => {
  const p = points;
  return Math.sqrt((p[2] - p[0]) ** 2 + (p[3] - p[1]) ** 2);
};

// Creates an inscribed n-sided polygon
export const calculatePolygonPoints = (
  width: number,
  height: number,
  sides: number
): number[] => {
  if (width === 0 || height === 0) return new Array(sides * 2).fill(0);
  const side = 180 / sides;
  const offset = degreeToRadian(90 - (90 - side));
  const points = new Array(sides * 2);

  for (let i = 0; i < points.length; i += 2) {
    points[i] = Math.cos(offset + degreeToRadian(side * i) + Math.PI / 2);
    points[i + 1] = Math.sin(offset + degreeToRadian(side * i) + Math.PI / 2);
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < points.length; i += 2) {
    minX = Math.min(minX, points[i]);
    minY = Math.min(minY, points[i + 1]);
    maxX = Math.max(maxX, points[i]);
    maxY = Math.max(maxY, points[i + 1]);
  }
  for (let i = 0; i < points.length; i += 2) {
    if (minX > -1 && points[i] < 0) points[i] /= -minX;
    if (minY > -1 && points[i + 1] < 0) points[i + 1] /= -minY;
    if (maxX < 1 && points[i] > 0) points[i] /= maxX;
    if (maxY < 1 && points[i + 1] > 0) points[i + 1] /= maxY;
  }
  for (let i = 0; i < points.length; i += 2)
    points[i] = ((points[i] + 1) * width) / 2;
  for (let i = 1; i < points.length; i += 2)
    points[i] = ((points[i] + 1) * height) / 2;

  return points;
};

const zoomVariants = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5];

export const calculateZoom = (state: IScroll & BrowserState, delta: number) => {
  const result = {
    ...state
  };
  let nextZoom = state.zoom;
  const zoomVariantIndex = zoomVariants.findIndex(
    variant => variant === state.zoom
  );
  if (delta > 0) {
    if (zoomVariantIndex !== zoomVariants.length - 1)
      nextZoom = zoomVariants[zoomVariantIndex + 1];
  } else if (zoomVariantIndex !== 0)
    nextZoom = zoomVariants[zoomVariantIndex - 1];
  result.zoom = nextZoom;

  const {
    canvasHeight,
    canvasWidth,
    layerHeight,
    layerWidth,
    layerX,
    layerY,
    verticalBar,
    horizontalBar
  } = state;

  const innerWidth = layerWidth * nextZoom;
  const availableWidth = canvasWidth - sp * 2 - 100;
  const nextLayerX = Math.max(
    layerX,
    canvasWidth > innerWidth ? 0 : canvasWidth - innerWidth
  );
  if (nextLayerX !== layerX) {
    result.layerX = nextLayerX;
    result.horizontalBar.x = Math.min(horizontalBar.x, layerWidth * nextZoom);
  }
  result.horizontalBar.x =
    (nextLayerX / (canvasWidth - innerWidth)) * availableWidth + sp;
  // copy for Y
  const innerHeight = layerHeight * nextZoom;
  const availableHeight = canvasHeight - sp * 2 - 100;
  const nextLayerY = Math.max(
    layerY,
    canvasHeight > innerHeight ? 0 : canvasHeight - innerHeight
  );
  if (nextLayerY !== layerY) {
    result.layerY = nextLayerY;
    result.verticalBar.y = Math.min(verticalBar.y, layerHeight * nextZoom);
  }
  result.verticalBar.y =
    (nextLayerY / (canvasHeight - innerHeight)) * availableHeight + sp;

  return result;
};
