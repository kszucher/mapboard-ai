import { mR } from '../getters/map-queries';
import { M_PADDING } from '../state/map-consts';
import { M } from '../state/map-types';

export const mapPlace = (m: M) => {
  mR(m).forEach(ri => {
    ri.nodeStartX = ri.offsetW + M_PADDING;
    ri.nodeStartY = ri.offsetH + M_PADDING;
  });
};
