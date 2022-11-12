import {mapProps, nodeProps} from "../core/DefaultProps";

export const mapDeinit = {
  start: (cm) => {
    for (const prop in cm.m) {
      if (mapProps.saveAlways.hasOwnProperty(prop)) {

      } else if (mapProps.saveOptional.hasOwnProperty(prop)) {
        if (cm.m[prop] === mapProps.saveOptional[prop]) {
          delete cm.m[prop]
        }
      } else {
        delete cm.m[prop]
      }
    }
    // TODO loop
    mapDeinit.iterate(cm.r[0])
    return cm
  },

  iterate: (cm) => {
    cm.d.map(i => mapDeinit.iterate(i))
    cm.s.map(i => mapDeinit.iterate(i))
    cm.c.map(i => i.map(j => mapDeinit.iterate(j)))
    for (const prop in cm) {
      if (nodeProps.saveAlways.hasOwnProperty(prop)) {

      } else if (nodeProps.saveOptional.hasOwnProperty(prop)) {
        if (cm[prop] === nodeProps.saveOptional[prop]) {
          delete cm[prop]
        }
      } else {
        delete cm[prop]
      }
    }
  }
}
