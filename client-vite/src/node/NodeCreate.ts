import { getMapData } from '../map/MapReducer'
import {Dir} from "../core/Enums"
import {getDefaultNode, isR} from "../core/MapUtils";

export const structCreate = (m: any, n: any, direction: Dir, payload: object) => {
  if (direction === Dir.U) {
    const pn = getMapData(m, n.parentPath) // FIXME getParentPath
    if (!pn.hasOwnProperty('s')) {pn.s = []}
    pn.s.splice(n.path.at(-1), 0, getDefaultNode({
      selected: 1,
      taskStatus: pn.taskStatus > 0 ?  1 : 0,
    }))
  } else if (direction === Dir.D) {
    const pn = getMapData(m, n.parentPath) // FIXME getParentPath
    if (!pn.hasOwnProperty('s')) {pn.s = []}
    pn.s.splice(n.path.at(-1) + 1, 0, getDefaultNode({
      selected: 1,
      taskStatus: pn.taskStatus > 0 ? 1 : 0,
    }));
  } else if (direction === Dir.O) {
    const pn = isR(n.path) ? n.d[0] : n
    if (!pn.hasOwnProperty('s')) {pn.s = []}
    pn.s.splice(pn.sCount, 0, getDefaultNode({
      selected: 1,
      taskStatus: pn.taskStatus,
      ...payload
    }))
  }
}

export const cellColCreate = (m: any, n: any, direction: Dir) => {
  const pn = getMapData(m, n.parentPath) // FIXME getParentPath
  const currCol = n.path.at(-1)
  const rowLen = pn.c.length
  if (direction === Dir.I) {
    for (let i = 0; i < rowLen; i++) {
      pn.c[i].splice(currCol, 0, getDefaultNode({s: [getDefaultNode()]}))
    }
  } else if (direction === Dir.O) {
    for (let i = 0; i < rowLen; i++) {
      pn.c[i].splice(currCol + 1, 0, getDefaultNode({s: [getDefaultNode()]}))
    }
  }
}

export const cellRowCreate = (m: any, n: any, direction: Dir) => {
  const pn = getMapData(m, n.parentPath) // FIXME getParentPath
  const currRow = n.path.at(-2)
  const colLen = pn.c[0].length
  if (direction === Dir.U) {
    let newRow = new Array(colLen)
    for (let i = 0; i < colLen; i++) {
      newRow[i] = getDefaultNode({s: [getDefaultNode()]})
    }
    pn.c.splice(currRow, 0, newRow)
  } else if (direction === Dir.D) {
    let newRow = new Array(colLen)
    for (let i = 0; i < colLen; i++) {
      newRow[i] = getDefaultNode({s: [getDefaultNode()]})
    }
    pn.c.splice(currRow + 1, 0, newRow)
  }
}
