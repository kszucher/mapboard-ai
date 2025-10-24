import { M } from '../schema/schema';

export const alignNodes = (m: M) => {
  const minOffsetX = Math.min(...m.n.map(ni => ni.offsetX));
  const minOffsetY = Math.min(...m.n.map(ni => ni.offsetY));
  m.n.map(ni => {
    ni.offsetX -= minOffsetX;
    ni.offsetY -= minOffsetY;
  });
};
