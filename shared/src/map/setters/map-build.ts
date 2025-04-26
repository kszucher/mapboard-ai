import { M } from '../state/map-types';
import { mapInit } from './map-init';
import { mapMeasure } from './map-measure';
import { mapPlace } from './map-place';
import { sortNode, sortPath } from './map-sort';

export const mapBuild = (m: M) => {
  m.sort(sortPath);
  mapInit(m);
  mapMeasure(m);
  mapPlace(m);
  m.sort(sortNode);
  Object.freeze(m);
};
