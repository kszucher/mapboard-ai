import { getLastIndexR } from '../getters/map-queries';
import { ControlType, L, M, R } from '../state/map-types';

export const mapInsert = {
  L: (m: M, partialL: Partial<L>, genId: Function) => Object.assign(m.l, {
    [genId()]: <L>{
      ...partialL,
    },
  }),

  R: (m: M, controlType: ControlType, genId: Function) => Object.assign(m.r, {
    [genId()]: <R>{
      iid: getLastIndexR(m) + 1,
      controlType,
      offsetW: m.g.selfW,
      offsetH: m.g.selfH,
    },
  }),
};
