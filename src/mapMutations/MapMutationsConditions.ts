import { getDR, getLR, getRR, getUR } from '../mapQueries/MapFindNearestR.ts';
import { getXR, isAXR, mR } from '../mapQueries/MapQueries.ts';
import { M } from '../mapState/MapStateTypes.ts';

export const mapMutationsConditions = {
  selectR: () => true,
  selectRAdd: () => true,
  selectR0: (m: M) => !isAXR(m),
  selectRA: (m: M) => isAXR(m),
  selectRDR: (m: M) => isAXR(m) && getDR(m, getXR(m)),
  selectRDRAdd: (m: M) => isAXR(m) && getDR(m, getXR(m)),
  selectRUR: (m: M) => isAXR(m) && getUR(m, getXR(m)),
  selectRURAdd: (m: M) => isAXR(m) && getUR(m, getXR(m)),
  selectRRR: (m: M) => isAXR(m) && getRR(m, getXR(m)),
  selectRRRAdd: (m: M) => isAXR(m) && getRR(m, getXR(m)),
  selectRLR: (m: M) => isAXR(m) && getLR(m, getXR(m)),
  selectRLRAdd: (m: M) => isAXR(m) && getLR(m, getXR(m)),

  unselect: (m: M) => isAXR(m),
  unselectR: () => true,

  insertL: () => true,

  insertRR: (m: M) => isAXR(m),
  insertRL: (m: M) => isAXR(m),
  insertRD: (m: M) => isAXR(m),
  insertRU: (m: M) => isAXR(m),

  deleteL: () => true,

  deleteLR: (m: M) => isAXR(m) && mR(m).some(ri => !ri.selected),

  cutLRJumpR: (m: M) => isAXR(m) && mR(m).some(ri => !ri.selected),
  copyLR: (m: M) => isAXR(m),
  pasteLR: () => true,
  duplicateLR: (m: M) => isAXR(m),

  offsetD: (m: M) => isAXR(m),
  offsetU: (m: M) => isAXR(m),
  offsetR: (m: M) => isAXR(m),
  offsetL: (m: M) => isAXR(m),
  offsetRByDrag: () => true,
};
