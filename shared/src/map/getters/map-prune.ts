import {
  gSaveAlways,
  gSaveOptional,
  lSaveAlways,
  lSaveOptional,
  rSaveAlways,
  rSaveOptional,
} from '../state/map-defaults';
import { LPartial, M, MPartial, RPartial } from '../state/map-types';
import { getNonDefaultEntries, includeEntries } from '../utils/object-utils';

export const mapPrune = (m: M): MPartial => {
  return {
    g: includeEntries(m.g, [
      ...Object.keys(gSaveAlways),
      ...getNonDefaultEntries(
        includeEntries(m.g, Object.keys(gSaveOptional)),
        gSaveOptional,
      ),
    ]),
    l: Object.fromEntries(
      Object.entries(m.l)
        .map(([nodeId, li]) => [
          nodeId,

          includeEntries(li, [
            ...Object.keys(lSaveAlways),
            ...getNonDefaultEntries(
              includeEntries(li, Object.keys(lSaveOptional)),
              lSaveOptional,
            ),
          ]) as LPartial,
        ]),
    ),
    r: Object.fromEntries(
      Object.entries(m.r)
        .map(([nodeId, ri]) => [
          nodeId,
          includeEntries(ri, [
            ...Object.keys(rSaveAlways),
            ...getNonDefaultEntries(
              includeEntries(ri, Object.keys(rSaveOptional)),
              rSaveOptional,
            ),
          ]) as RPartial,
        ]),
    ),
  };
};
