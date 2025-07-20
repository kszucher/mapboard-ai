import { M } from '../state/map-consts-and-types';

export const mapAlign = (m: M) => {
  const nl = Object.values(m.n);
  const minOffsetW = Math.min(...nl.map(ni => ni.offsetW));
  const minOffsetH = Math.min(...nl.map(ni => ni.offsetH));
  Object.values(m.n).map(ni => {
    ni.offsetW -= minOffsetW;
    ni.offsetH -= minOffsetH;
  });
};
