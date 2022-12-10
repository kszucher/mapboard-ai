// @ts-nocheck

import {mapProps, nodeProps} from "../core/DefaultProps";

export const mapDeInit = {
  start: (cn) => {
    for (const prop in cn) {
      if (prop !== 'r') {
        if (mapProps.saveOptional.hasOwnProperty(prop)) {
          if (cn[prop] === mapProps.saveOptional[prop]) {
            delete cn[prop]
          }
        } else {
          delete cn[prop]
        }
      }
    }
    mapDeInit.iterate(cn.r[0])
    return cn
  },

  iterate: (cn) => {
    cn.d.map(i => mapDeInit.iterate(i))
    cn.s.map(i => mapDeInit.iterate(i))
    cn.c.map(i => i.map(j => mapDeInit.iterate(j)))
    for (const prop in cn) {
      if (nodeProps.saveAlways.hasOwnProperty(prop)) {

      } else if (nodeProps.saveOptional.hasOwnProperty(prop)) {
        if (cn[prop] === nodeProps.saveOptional[prop]) {
          delete cn[prop]
        }
      } else {
        delete cn[prop]
      }
    }
  }
}
