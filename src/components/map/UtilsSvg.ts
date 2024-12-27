import { idToR } from '../../data/clientSide/mapGetters/MapQueries.ts';
import { L, M, R, Side } from '../../data/clientSide/mapState/MapStateTypes.ts';

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

export const getBezierLinePath = (c: string, [x1, y1, c1x, c1y, c2x, c2y, x2, y2]: number[]) =>
  `${c}${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;

const getCoordinatesForSide = (node: R, side: Side): { x: number; y: number; cx: number; cy: number } => {
  const { nodeStartX, nodeStartY, selfW, selfH } = node;
  const offset = 100;
  switch (side) {
    case Side.R:
      return {
        x: nodeStartX + selfW,
        y: nodeStartY + selfH / 2,
        cx: nodeStartX + selfW + offset,
        cy: nodeStartY + selfH / 2,
      };
    case Side.L:
      return {
        x: nodeStartX,
        y: nodeStartY + selfH / 2,
        cx: nodeStartX - offset,
        cy: nodeStartY + selfH / 2,
      };
  }
};

export const getRootLinePath = (m: M, l: L) => {
  const { fromNodeId, fromNodeSide, toNodeId, toNodeSide } = l;
  const fromNode = idToR(m, fromNodeId);
  const toNode = idToR(m, toNodeId);
  const { x: sx, y: sy, cx: c1x, cy: c1y } = getCoordinatesForSide(fromNode, fromNodeSide);
  const { x: ex, y: ey, cx: c2x, cy: c2y } = getCoordinatesForSide(toNode, toNodeSide);
  return [sx, sy, c1x, c1y, c2x, c2y, ex, ey];
};
