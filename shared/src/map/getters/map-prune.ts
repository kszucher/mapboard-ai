import {
  gSaveAlways,
  gSaveOptional,
  lSaveAlways,
  lSaveOptional,
  rSaveAlways,
  rSaveOptional,
} from '../state/map-state-defaults';
import { M } from '../state/map-state-types';
import { sortNode } from '../setters/map-sort';
import { getNonDefaultEntries, includeEntries } from '../utils/object-utils';
import { mG, mL, mR } from './map-queries';

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
