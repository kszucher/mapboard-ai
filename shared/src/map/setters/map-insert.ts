import { getControlTypeDimensions, getLastIndexN, getMapSelfH, getMapSelfW } from '../getters/map-queries';
import { ControlType, L, M, N } from '../state/map-consts-and-types';
import { lDefault, nDefault } from '../state/map-defaults';

export const mapInsert = {
  L: (m: M, partialL: Partial<L>, genId: Function) => Object.assign(m.l, {
    [genId()]: <L>{
      ...lDefault,
      ...partialL,
    },
  }),

  N: (m: M, controlType: ControlType, genId: Function) => Object.assign(m.n, {
    [genId()]: <N>{
      ...nDefault,
      iid: getLastIndexN(m) + 1,
      controlType,
      offsetW: getMapSelfW(m),
      offsetH: getMapSelfH(m),
      selfW: getControlTypeDimensions(controlType).w,
      selfH: getControlTypeDimensions(controlType).h,
    },
  }),
};
