import { getLastIndexR, getMapSelfH, getMapSelfW } from '../getters/map-queries';
import { getControlTypeDimensions } from '../state/map-consts';
import { lDefault, rDefault } from '../state/map-defaults';
import { ControlType, L, M, R } from '../state/map-types';

export const mapInsert = {
  L: (m: M, partialL: Partial<L>, genId: Function) => Object.assign(m.l, {
    [genId()]: <L>{
      ...lDefault,
      ...partialL,
    },
  }),

  R: (m: M, controlType: ControlType, genId: Function) => Object.assign(m.r, {
    [genId()]: <R>{
      ...rDefault,
      iid: getLastIndexR(m) + 1,
      controlType,
      offsetW: getMapSelfW(m),
      offsetH: getMapSelfH(m),
      selfW: getControlTypeDimensions(controlType).w,
      selfH: getControlTypeDimensions(controlType).h,
    },
  }),
};
