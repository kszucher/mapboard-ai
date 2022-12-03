import {getDefaultNode} from "../core/DefaultProps";
import { getMapData } from '../core/MapFlow'
import {Dir} from "../core/Types";

export const structCreate = (m: any, ln: any, direction: Dir, payload: object ) => {
  let parentRef;
  if (direction === Dir.U) {
    parentRef = getMapData(m, ln.parentPath);
    parentRef.s.splice(ln.index, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus > - 1 ?  0 : -1,
    }))
  } else if (direction === Dir.D) {
    parentRef = getMapData(m, ln.parentPath);
    parentRef.s.splice(ln.index + 1, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus > - 1 ? 0 : -1,
    }));
  } else if (direction === Dir.O) {
    parentRef = ln.isRoot? ln.d[0] : ln;
    parentRef.s.splice(parentRef.s.length, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus,
      ...payload
    }))
  }
}

export const cellCreate = (m: any, lastPath: any, key: any) => {
  let ln = getMapData(m, lastPath);
  let parentRef = getMapData(m, ln.parentPath);
  let currRow = ln.index[0];
  let currCol = ln.index[1];
  let rowLen = parentRef.c.length;
  let colLen = parentRef.c[0].length;
  let direction;
  if (        key === 'ArrowLeft' && ln.path[3] === 0 || key === 'ArrowRight' && ln.path[3] === 1) {  direction = 'in';
  } else if ( key === 'ArrowLeft' && ln.path[3] === 1 || key === 'ArrowRight' && ln.path[3] === 0) {  direction = 'out';
  } else if ( key === 'ArrowUp') {                                                                    direction = 'up';
  } else if ( key === 'ArrowDown') {                                                                  direction = 'down';
  }
  switch (direction) {
    case 'in': {
      for (let i = 0; i < rowLen; i++) {
        parentRef.c[i].splice(currCol, 0, getDefaultNode({s: [getDefaultNode()]}));
      }
      break;
    }
    case 'out': {
      for (let i = 0; i < rowLen; i++) {
        parentRef.c[i].splice(currCol + 1, 0, getDefaultNode({s: [getDefaultNode()]}));
      }
      break;
    }
    case 'up': {
      let newRow = new Array(colLen);
      for (let i = 0; i < colLen; i++) {
        newRow[i] = getDefaultNode({s: [getDefaultNode()]});
      }
      parentRef.c.splice(currRow, 0, newRow);
      break;
    }
    case 'down': {
      let newRow = new Array(colLen);
      for (let i = 0; i < colLen; i++) {
        newRow[i] = getDefaultNode({s: [getDefaultNode()]});
      }
      parentRef.c.splice(currRow + 1, 0, newRow);
      break;
    }
    default:
      break;
  }
}
