import {
  amber,
  blue,
  bronze,
  brown,
  crimson,
  cyan,
  gold,
  grass,
  gray,
  green,
  indigo,
  iris,
  jade,
  lime,
  mint,
  orange,
  pink,
  plum,
  purple,
  red,
  ruby,
  sky,
  teal,
  tomato,
  violet,
  yellow,
} from '@radix-ui/colors';
import { BadgeProps } from '@radix-ui/themes';

export const radixColorMap: Partial<Record<NonNullable<BadgeProps['color']>, string>> = {
  amber: amber.amber9,
  blue: blue.blue9,
  bronze: bronze.bronze9,
  brown: brown.brown9,
  crimson: crimson.crimson9,
  cyan: cyan.cyan9,
  gold: gold.gold9,
  grass: grass.grass9,
  gray: gray.gray9,
  green: green.green9,
  indigo: indigo.indigo9,
  iris: iris.iris9,
  jade: jade.jade9,
  lime: lime.lime9,
  mint: mint.mint9,
  orange: orange.orange9,
  pink: pink.pink9,
  plum: plum.plum9,
  purple: purple.purple9,
  red: red.red9,
  ruby: ruby.ruby9,
  sky: sky.sky9,
  teal: teal.teal9,
  tomato: tomato.tomato9,
  violet: violet.violet9,
  yellow: yellow.yellow9,
};

export const pathCommonProps = {
  vectorEffect: 'non-scaling-stroke',
  style: {
    transition: 'all 0.3s',
    transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
    transitionProperty: 'd, fill, stroke-width',
  },
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
