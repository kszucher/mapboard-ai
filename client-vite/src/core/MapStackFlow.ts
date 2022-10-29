// @ts-nocheck

import { mapAssembly } from '../map/MapAssembly'
import { copy, subsref } from './Utils'
import { mapDeinit } from '../map/MapDeinit'
import { mapDisassembly } from '../map/MapDisassembly'
import { recalc } from './MapFlow'
import {sagaActions} from "./EditorFlow";

export let mapStack = {
  data: [],
  dataIndex: 0,
}

export function mapStackDispatch(action, payload) {
  console.log('MAPDISPATCH: ' + action)
  mapStackReducer(action, payload)
  recalc()
}

function mapStackReducer(action, payload) {
  switch (action) {
    case 'initMapState': {
      mapStack.data = [mapAssembly(payload.mapData)]
      mapStack.dataIndex = 0 // this can be easily done by requesting the backend to send a 0 value
      break
    }
    case 'undo': {
      if (mapStack.dataIndex > 0) {
        mapStack.dataIndex--
      }
      break
    }
    case 'redo': {
      if (mapStack.dataIndex < mapStack.data.length - 1) {
        mapStack.dataIndex++
      }
      break
    }
  }
}

export function push() {
  if (mapStack.data.length > mapStack.dataIndex + 1) {
    mapStack.data.length = mapStack.dataIndex + 1
  }
  mapStack.data.push(JSON.parse(JSON.stringify(mapStack.data[mapStack.dataIndex])))
  mapStack.dataIndex++
}

export function checkPop(dispatch) {
  if (JSON.stringify(mapStack.data[mapStack.dataIndex]) ===
    JSON.stringify(mapStack.data[mapStack.dataIndex - 1])) {
    mapStack.data.length--
    mapStack.dataIndex--
  } else {
    // console.log(JSON.stringify(mapStack.data[mapStack.dataIndex]))
    // console.log(JSON.stringify(mapStack.data[mapStack.dataIndex - 1]))
    dispatch(sagaActions.mapStackChanged())
  }
}

export function mapref(path) {
  return subsref(mapStack.data[mapStack.dataIndex], path)
}

// this is a getter, same as when we loadNode, so should be placed accordingly
export function saveMap() {
  let cm = copy(mapStack.data[mapStack.dataIndex])
  mapDeinit.start(cm)
  return mapDisassembly.start(cm)
}
