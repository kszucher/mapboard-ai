// @ts-nocheck

import { mapAssembly } from '../map/MapAssembly'
import { copy, subsref } from './Utils'
import { mapDeinit } from '../map/MapDeinit'
import { mapDisassembly } from '../map/MapDisassembly'
import { recalc } from './MapFlow'

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
            mapStack.dataIndex = 0
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

const getMapStackData = () => {
    return mapStack.data[mapStack.dataIndex]
}

export function push() {
    if (mapStack.data.length > mapStack.dataIndex + 1) {
        mapStack.data.length = mapStack.dataIndex + 1
    }
    mapStack.data.push(JSON.parse(JSON.stringify(getMapStackData())))
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
        dispatch({ type: 'MAP_STACK_CHANGED' })
    }
}

export function mapref(path) {
    return subsref(getMapStackData(), path)
}

export function saveMap() {
    let cm = copy(getMapStackData())
    mapDeinit.start(cm)
    return mapDisassembly.start(cm)
}
