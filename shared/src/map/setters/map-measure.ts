import { M_PADDING, R_PADDING } from '../state/map-consts';
import { ControlType, M } from '../state/map-types';

export const mapMeasure = (m: M) => {
  const rl = Object.values(m.r);
  const minOffsetW = Math.min(...rl.map(ri => ri.offsetW));
  const minOffsetH = Math.min(...rl.map(ri => ri.offsetH));
  rl.forEach(ri => {
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
      case ControlType.VECTOR_DATABASE:
        ri.selfW = 160;
        ri.selfH = 60;
        break;
      case ControlType.TEXT_INPUT:
        ri.selfW = 200;
        ri.selfH = 200;
        break;
      case ControlType.TEXT_OUTPUT:
        ri.selfW = 200;
        ri.selfH = 200;
        break;
    }
    ri.selfW += 2 * R_PADDING;
    ri.selfH += 2 * R_PADDING;
    m.g.selfW = Math.max(...rl.map(ri => ri.offsetW + ri.selfW)) + 2 * M_PADDING;
    m.g.selfH = Math.max(...rl.map(ri => ri.offsetH + ri.selfH)) + 2 * M_PADDING;
  });
};
