import { M_PADDING } from '../mapState/MapConsts.ts';
import { mR } from '../mapGetters/MapQueries.ts';
import { M } from '../mapState/MapStateTypes.ts';

export const mapPlace = (m: M) => {
  mR(m).forEach(ri => {
    ri.nodeStartX = ri.offsetW + M_PADDING;
    ri.nodeStartY = ri.offsetH + M_PADDING;
  });
};
