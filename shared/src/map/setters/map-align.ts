import { M } from '../state/map-types';

export const mapAlign = (m: M) => {
  const rl = Object.values(m.r);
  const minOffsetW = Math.min(...rl.map(ri => ri.offsetW));
  const minOffsetH = Math.min(...rl.map(ri => ri.offsetH));
  rl.forEach(ri => {
    Object.assign(ri, {
      offsetW: ri.offsetW - minOffsetW,
      offsetH: ri.offsetH - minOffsetH,
    });
  });
};
