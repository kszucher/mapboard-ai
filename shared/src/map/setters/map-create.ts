import { rDefault } from '../state/map-defaults';
import { M } from '../state/map-types';

export const createNewMapData = (genId: Function): M => {
  return {
    g: { isLocked: false },
    l: {},
    r: { [genId()]: { ...rDefault, iid: 0 } },
  };
};
