// @ts-nocheck

import {mapProps, nodeProps} from "../core/DefaultProps";

export const mapDeInit = {
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
    mapDeInit.iterate(cm.r[0])
    return cm
  },

  iterate: (cm) => {
    cm.d.map(i => mapDeInit.iterate(i))
    cm.s.map(i => mapDeInit.iterate(i))
    cm.c.map(i => i.map(j => mapDeInit.iterate(j)))
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
