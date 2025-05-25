import { M } from '../state/map-types';
import { mapInit } from './map-init';
import { mapMeasure } from './map-measure';
import { mapPlace } from './map-place';

export const mapBuild = (m: M) => {
  mapInit(m);
  mapMeasure(m);
  mapPlace(m);
  Object.freeze(m);
};
