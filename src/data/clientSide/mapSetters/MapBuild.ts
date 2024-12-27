import { M } from '../mapState/MapStateTypes.ts';
import { mapInit } from './MapInit.ts';
import { mapMeasure } from './MapMeasure.ts';
import { mapPlace } from './MapPlace.ts';
import { sortNode, sortPath } from './MapSort.ts';

export const mapBuild = (m: M) => {
  m.sort(sortPath);
  mapInit(m);
  mapMeasure(m);
  mapPlace(m);
  m.sort(sortNode);
  Object.freeze(m);
};
