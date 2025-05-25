import { M } from '../state/map-types';

export const mapDelete = {
  L: (m: M, lNodeId: string) => {
    delete m.l[lNodeId];
  },

  LR: (m: M, nodeId: string) => {
    Object.entries(m.l)
      .filter(([nodeId, li]) => [li.fromNodeId, li.toNodeId].includes(nodeId))
      .forEach(([nodeId]) => delete m.l[nodeId]);

    delete m.r[nodeId];

    const nonSelectedMinOffsetW = Math.min(...Object.values(m.r).map(ri => ri.offsetW));
    const nonSelectedMinOffsetH = Math.min(...Object.values(m.r).map(ri => ri.offsetH));
    Object.values(m.r).map(ri => {
      ri.offsetW -= nonSelectedMinOffsetW;
      ri.offsetH -= nonSelectedMinOffsetH;
    });
  },
};
