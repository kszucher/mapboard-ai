import { getG, getLastIndexL, getLastIndexR } from '../mapGetters/MapQueries.ts';
import { L, M, R } from '../mapState/MapStateTypes.ts';
import { ControlType } from '../mapState/MapStateTypesEnums.ts';

export const mapInsert = {
  L: (m: M, partialL: Partial<L>) => {
    m.push(<L>{
      path: ['l', getLastIndexL(m) + 1],
      ...partialL,
    });
  },

  R: (m: M, controlType: ControlType) => {
    const lastIndexR = getLastIndexR(m);
    m.push(<R>{
      path: ['r', lastIndexR + 1],
      controlType,
      offsetW: getG(m).selfW,
      offsetH: getG(m).selfH,
    });
  },
};
