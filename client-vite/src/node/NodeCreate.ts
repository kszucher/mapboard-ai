import {getDefaultNode} from "../core/DefaultProps"
import { getMapData } from '../core/MapFlow'
import {Dir} from "../core/Types"

export const structCreate = (m: any, n: any, direction: Dir, payload: object ) => {
  let parentRef;
  if (direction === Dir.U) {
    parentRef = getMapData(m, n.parentPath)
    parentRef.s.splice(n.index, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus > - 1 ?  0 : -1,
    }))
  } else if (direction === Dir.D) {
    parentRef = getMapData(m, n.parentPath)
    parentRef.s.splice(n.index + 1, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus > - 1 ? 0 : -1,
    }));
  } else if (direction === Dir.O) {
    parentRef = n.isRoot? n.d[0] : n
    parentRef.s.splice(parentRef.s.length, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus,
      ...payload
    }))
  }
}

export const cellColCreate = (m: any, n: any, direction: Dir) => {
  const pn = getMapData(m, n.parentPath)
  const currCol = n.index[1]
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
  const pn = getMapData(m, n.parentPath)
  const currRow = n.index[0]
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
