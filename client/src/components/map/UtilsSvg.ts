import { brown, cyan, jade, lime, violet, yellow } from '@radix-ui/colors';

export const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill, stroke-width',
  },
};

export const radixColorMap: Record<string, string> = {
  yellow: yellow.yellow5,
  cyan: cyan.cyan9,
  violet: violet.violet9,
  lime: lime.lime9,
  brown: brown.brown9,
  jade: jade.jade9,
};

export const getLinearLinePath = ({ x1, x2, y1, y2 }: { x1: number; x2: number; y1: number; y2: number }) =>
  `M${x1},${y1} L${x2},${y2}`;

export const getBezierLinePath = ([x1, y1, c1x, c1y, c2x, c2y, x2, y2]: number[]) =>
  `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`;

export const getBezierLineCoords = ([sx, sy, ex, ey]: number[]) => {
  const controlOffset = 100;
  return [sx, sy, sx + controlOffset, sy, ex - controlOffset, ey, ex, ey];
};

export const getBezierLineCoordsMid = ([sx, sy, c1x, c1y, c2x, c2y, ex, ey]: number[]) => {
  const t = 0.5;
  const mt = 1 - t;
  const x = mt * mt * mt * sx + 3 * mt * mt * t * c1x + 3 * mt * t * t * c2x + t * t * t * ex;
  const y = mt * mt * mt * sy + 3 * mt * mt * t * c1y + 3 * mt * t * t * c2y + t * t * t * ey;
  return { x, y };
};
