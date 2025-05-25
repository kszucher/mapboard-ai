import {
  gSaveAlways,
  gSaveNever,
  gSaveOptional,
  lSaveAlways,
  lSaveNever,
  lSaveOptional,
  rSaveAlways,
  rSaveNever,
  rSaveOptional,
} from '../state/map-defaults';
import { MPartial } from '../state/map-types';
import { excludeEntries } from '../utils/object-utils';

export const mapInit = (m: MPartial) => {
  Object.assign(
    m.g,
    structuredClone({
      ...excludeEntries(gSaveAlways, Object.keys(m.g)),
      ...excludeEntries(gSaveOptional, Object.keys(m.g)),
      ...gSaveNever,
    }),
  );

  Object.values(m.l).forEach(li => {
    Object.assign(
      li,
      structuredClone({
        ...excludeEntries(lSaveAlways, Object.keys(li)),
        ...excludeEntries(lSaveOptional, Object.keys(li)),
        ...lSaveNever,
      }),
    );
  });
  
  Object.values(m.r).forEach(ri => {
    Object.assign(
      ri,
      structuredClone({
        ...excludeEntries(rSaveAlways, Object.keys(ri)),
        ...excludeEntries(rSaveOptional, Object.keys(ri)),
        ...rSaveNever,
      }),
    );
  });
};
