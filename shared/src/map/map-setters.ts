import { M } from '../api/api-types-map';

export const alignNodes = (m: M) => {
  const minOffsetW = Math.min(...m.n.map(ni => ni.offsetW));
  const minOffsetH = Math.min(...m.n.map(ni => ni.offsetH));
  m.n.map(ni => {
    ni.offsetW -= minOffsetW;
    ni.offsetH -= minOffsetH;
  });
};
