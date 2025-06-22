import { getNodeStartX, getNodeStartY } from '../../../../shared/src/map/getters/map-queries.ts';
import { L, M, R, Side } from '../../../../shared/src/map/state/map-types.ts';

export const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill, stroke-width',
  },
};

export const getCoordsMidBezier = ([sx, sy, c1x, c1y, c2x, c2y, ex, ey]: number[]) => {
  const t = 0.5;
  const mt = 1 - t;
  const x = mt * mt * mt * sx + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * ex;
  const y = mt * mt * mt * sy + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * ey;
  return { x, y };
};

export const getLinearLinePath = ({ x1, x2, y1, y2 }: { x1: number; x2: number; y1: number; y2: number }) =>
  `M${x1},${y1} L${x2},${y2}`;

export const getBezierLinePath = ([x1, y1, c1x, c1y, c2x, c2y, x2, y2]: number[]) =>
  `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;

const getControlPoint = (x: number, y: number, side: Side): { cx: number; cy: number } => {
  const controlOffset = 100;
  return {
    cx: side === Side.R ? x + controlOffset : x - controlOffset,
    cy: y,
  };
};

const getCoordinatesForSide = (
  r: R,
  side: Side,
  sideIndex: number
): {
  x: number;
  y: number;
} => {
  const yBaseOffset = 60;
  const yOffset = 20;
  const nodeStartX = getNodeStartX(r);
  const nodeStartY = getNodeStartY(r);
  const y = nodeStartY + yBaseOffset + sideIndex * yOffset;

  const x = side === Side.R ? nodeStartX + r.selfW - 10 : nodeStartX + 10;

  return { x, y };
};

export const getRootLinePath = (m: M, l: L) => {
  const { fromNodeId, fromNodeSide, fromNodeSideIndex, toNodeId, toNodeSide, toNodeSideIndex } = l;

  const { x: sx, y: sy } = getCoordinatesForSide(m.r[fromNodeId], fromNodeSide, fromNodeSideIndex);
  const { x: ex, y: ey } = getCoordinatesForSide(m.r[toNodeId], toNodeSide, toNodeSideIndex);

  const { cx: c1x, cy: c1y } = getControlPoint(sx, sy, fromNodeSide);
  const { cx: c2x, cy: c2y } = getControlPoint(ex, ey, toNodeSide);

  return [sx, sy, c1x, c1y, c2x, c2y, ex, ey];
};

export const getBezierCoords = (m: M, l: L) => {
  const coords = getRootLinePath(m, l);
  return getCoordsMidBezier(coords);
};
