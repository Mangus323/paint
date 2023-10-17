const degreeToRadian = (deg: number) => (Math.PI * deg) / 180;
export const twoPointsToDegree = (points: number[]) => {
  let [x1, y1, x2, y2] = points;
  let result = (180 / Math.PI) * Math.atan2(y2 - y1, x2 - x1) + 90;

  return result < 0 ? result + 360 : result;
};

export const twoPointsToDegreeSmooth = (points: number[], sides: number) => {
  const originalAngle = twoPointsToDegree(points);
  const sideDegrees = 360 / sides;
  const sideAngle = originalAngle % sideDegrees;
  const smoothAngle = (~~(originalAngle / sideDegrees) * 360) / sides;

  if (sideAngle > sideDegrees / 2) {
    return smoothAngle + sideDegrees;
  }
  return smoothAngle;
};

const getSecondPoint = (point: number[], angle: number, length: number) => {
  angle -= 90;
  const x = point[0] + length * Math.cos(degreeToRadian(angle));
  const y = point[1] + length * Math.sin(degreeToRadian(angle));
  return [x, y];
};

export const twoPointsToSmoothPoints = (points: number[], sides: number) => {
  const length = getTwoPointsLength(points);
  const angle = twoPointsToDegreeSmooth(points, sides);

  return [points[0], points[1], ...getSecondPoint(points, angle, length)];
};

const getTwoPointsLength = (points: number[]) => {
  const p = points;
  return Math.sqrt((p[2] - p[0]) ** 2 + (p[3] - p[1]) ** 2);
};

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
