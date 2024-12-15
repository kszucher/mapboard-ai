import { sortNode } from '../mapMutations/MapSort.ts';
import {
  gSaveAlways,
  gSaveOptional,
  lSaveAlways,
  lSaveOptional,
  rSaveAlways,
  rSaveOptional,
} from '../mapState/MapState.ts';
import { M } from '../mapState/MapStateTypes.ts';
import { getNonDefaultEntries, includeEntries } from '../utils/Utils.ts';
import { mG, mL, mR } from './MapQueries.ts';

export const mapPrune = (m: M) => {
  return (
    [
      ...mG(m).map(gi => ({
        ...includeEntries(gi, [
          ...Object.keys(gSaveAlways),
          ...getNonDefaultEntries(includeEntries(gi, Object.keys(gSaveOptional)), gSaveOptional),
        ]),
      })),
      ...mL(m).map(li => ({
        ...includeEntries(li, [
          ...Object.keys(lSaveAlways),
          ...getNonDefaultEntries(includeEntries(li, Object.keys(lSaveOptional)), lSaveOptional),
        ]),
      })),
      ...mR(m).map(ri => ({
        ...includeEntries(ri, [
          ...Object.keys(rSaveAlways),
          ...getNonDefaultEntries(includeEntries(ri, Object.keys(rSaveOptional)), rSaveOptional),
        ]),
      })),
    ] as M
  ).sort(sortNode);
};
