import {Dir} from "../core/Enums"
import {getDefaultNode, pathSorter} from "../map/MapUtils";
import {Path} from "../state/MTypes";

export const structCreate = (m: any, dir: Dir, payload: object) => {
  if (dir === Dir.U) {
    // const pn = getMapData(m, n.parentPath) // FIXME getParentPath
    // if (!pn.hasOwnProperty('s')) {pn.s = []}
    // pn.s.splice(n.path.at(-1), 0, getDefaultNode({
    //   selected: 1,
    //   taskStatus: pn.taskStatus > 0 ?  1 : 0,
    // }))
  } else if (dir === Dir.D) {
    // const pn = getMapData(m, n.parentPath) // FIXME getParentPath
    // if (!pn.hasOwnProperty('s')) {pn.s = []}
    // pn.s.splice(n.path.at(-1) + 1, 0, getDefaultNode({
    //   selected: 1,
    //   taskStatus: pn.taskStatus > 0 ? 1 : 0,
    // }));
  } else if (dir === Dir.O) {
    // const pn = isR(n.path) ? n.d[0] : n
    // if (!pn.hasOwnProperty('s')) {pn.s = []}
    // pn.s.splice(pn.sCount, 0, getDefaultNode({
    //   selected: 1,
    //   taskStatus: pn.taskStatus,
    //   ...payload
    // }))


    m.push(getDefaultNode({ path: structuredClone([  /* TODO figure out the path of what can be added */ ])})).sort(pathSorter) // TODO start here, EZ


  } else if (dir === Dir.OR) {

  } else if (dir === Dir.OL) {

  }
}

export const cellColCreate = (m: any, n: any, dir: Dir) => {
  // const pn = getMapData(m, n.parentPath) // FIXME getParentPath
  // const currCol = n.path.at(-1)
  // const rowLen = pn.c.length
  // if (dir === Dir.I) {
  //   for (let i = 0; i < rowLen; i++) {
  //     pn.c[i].splice(currCol, 0, getDefaultNode({s: [getDefaultNode()]}))
  //   }
  // } else if (dir === Dir.O) {
  //   for (let i = 0; i < rowLen; i++) {
  //     pn.c[i].splice(currCol + 1, 0, getDefaultNode({s: [getDefaultNode()]}))
  //   }
  // }
}

export const cellRowCreate = (m: any, n: any, dir: Dir) => {
  // const pn = getMapData(m, n.parentPath) // FIXME getParentPath
  // const currRow = n.path.at(-2)
  // const colLen = pn.c[0].length
  // if (dir === Dir.U) {
  //   let newRow = new Array(colLen)
  //   for (let i = 0; i < colLen; i++) {
  //     newRow[i] = getDefaultNode({s: [getDefaultNode()]})
  //   }
  //   pn.c.splice(currRow, 0, newRow)
  // } else if (dir === Dir.D) {
  //   let newRow = new Array(colLen)
  //   for (let i = 0; i < colLen; i++) {
  //     newRow[i] = getDefaultNode({s: [getDefaultNode()]})
  //   }
  //   pn.c.splice(currRow + 1, 0, newRow)
  // }
}
