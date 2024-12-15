import { R_SELF_H_MIN, R_SELF_W_MIN, R_SPACING } from '../mapConsts/MapConsts.ts';
import { getLastIndexL, getLastIndexR, getXR } from '../mapQueries/MapQueries.ts';
import { L, M, R } from '../mapState/MapStateTypes.ts';
import { mapUnselect } from './MapSelect';

export const mapInsert = {
  L: (m: M, partialL: Partial<L>) => {
    m.push(<L>{
      path: ['l', getLastIndexL(m) + 1],
      ...partialL,
    });
  },

  RR: (m: M) => {
    const xr = getXR(m);
    const lastIndexR = getLastIndexR(m);
    mapUnselect.Nodes(m);
    m.push(<R>{
      path: ['r', lastIndexR + 1],
      selected: 1,
      offsetW: xr.offsetW + xr.selfW + R_SPACING,
      offsetH: xr.offsetH,
    });
  },

  RL: (m: M) => {
    const xr = getXR(m);
    const lastIndexR = getLastIndexR(m);
    mapUnselect.Nodes(m);
    m.push(<R>{
      path: ['r', lastIndexR + 1],
      selected: 1,
      offsetW: xr.offsetW - R_SPACING - R_SELF_W_MIN,
      offsetH: xr.offsetH,
    });
  },

  RD: (m: M) => {
    const xr = getXR(m);
    const lastIndexR = getLastIndexR(m);
    mapUnselect.Nodes(m);
    m.push(<R>{
      path: ['r', lastIndexR + 1],
      selected: 1,
      offsetW: xr.offsetW,
      offsetH: xr.offsetH + xr.selfH + R_SPACING,
    });
  },

  RU: (m: M) => {
    const xr = getXR(m);
    const lastIndexR = getLastIndexR(m);
    mapUnselect.Nodes(m);
    m.push(<R>{
      path: ['r', lastIndexR + 1],
      selected: 1,
      offsetW: xr.offsetW,
      offsetH: xr.offsetH - R_SPACING - R_SELF_H_MIN,
    });
  },
};
