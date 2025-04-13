import { M_PADDING, R_PADDING } from '../mapState/MapConsts.ts';
import { getG, mR } from '../mapGetters/MapQueries.ts';
import { ControlType, M } from '../mapState/MapStateTypes.ts';

export const mapMeasure = (m: M) => {
  const minOffsetW = Math.min(...mR(m).map(ri => ri.offsetW));
  const minOffsetH = Math.min(...mR(m).map(ri => ri.offsetH));
  mR(m).forEach(ri => {
    Object.assign(ri, {
      offsetW: ri.offsetW - minOffsetW,
      offsetH: ri.offsetH - minOffsetH,
    });
    switch (ri.controlType) {
      case ControlType.FILE:
        ri.selfW = 160;
        ri.selfH = 90;
        break;
      case ControlType.INGESTION:
        ri.selfW = 160;
        ri.selfH = 90;
        break;
      case ControlType.EXTRACTION:
        ri.selfW = 200;
        ri.selfH = 210;
        break;
      case ControlType.TEXT_INPUT:
        ri.selfW = 200;
        ri.selfH = 200;
        break;
      case ControlType.TEXT_OUTPUT:
        ri.selfW = 400;
        ri.selfH = 430;
        break;
    }
    ri.selfW += 2 * R_PADDING;
    ri.selfH += 2 * R_PADDING;
    const g = getG(m);
    g.selfW = Math.max(...mR(m).map(ri => ri.offsetW + ri.selfW)) + 2 * M_PADDING;
    g.selfH = Math.max(...mR(m).map(ri => ri.offsetH + ri.selfH)) + 2 * M_PADDING;
  });
};
