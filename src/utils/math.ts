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
  const x = point[0] + length * Math.cos((angle / 180) * Math.PI);
  const y = point[1] + length * Math.sin((angle / 180) * Math.PI);
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
