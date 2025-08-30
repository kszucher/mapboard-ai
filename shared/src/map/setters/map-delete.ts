import { M } from '../state/map-consts-and-types';

export const mapDelete = {
  L: (m: M, linkId: string) => {
    delete m.l[linkId];
  },

  NL: (m: M, nodeId: string) => {
    Object.entries(m.l)
      .filter(([, li]) => [li.fromNodeId, li.toNodeId].includes(nodeId))
      .forEach(([linkId]) => delete m.l[linkId]);

    delete m.n[nodeId];
  },
};
