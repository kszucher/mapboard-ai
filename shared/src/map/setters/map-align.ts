import { M } from '../state/map-types';

export const mapAlign = (m: M) => {
  const rl = Object.values(m.r);
  const minOffsetW = Math.min(...rl.map(ri => ri.offsetW));
  const minOffsetH = Math.min(...rl.map(ri => ri.offsetH));
  Object.values(m.r).map(ri => {
    ri.offsetW -= minOffsetW;
    ri.offsetH -= minOffsetH;
  });
};
