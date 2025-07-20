import { M } from '../state/map-consts-and-types';

export const mapDelete = {
  L: (m: M, lNodeId: string) => {
    delete m.l[lNodeId];
  },

  NL: (m: M, nodeId: string) => {
    Object.entries(m.l)
      .filter(([, li]) => [li.fromNodeId, li.toNodeId].includes(nodeId))
      .forEach(([nodeId]) => delete m.l[nodeId]);

    delete m.n[nodeId];
  },
};
