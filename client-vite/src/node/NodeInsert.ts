// @ts-nocheck

import {getDefaultNode} from "../core/DefaultProps";
import { getMapData } from '../core/MapFlow'

export const structInsert = (m, lm, mode, payload ) => {
  let parentRef;
  if (mode === 'siblingUp') {
    parentRef = getMapData(m, lm.parentPath);
    parentRef.s.splice(lm.index, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus > - 1 ?  0 : -1,
      parentNodeEndXFrom: parentRef.nodeEndX,
      parentNodeStartXFrom: parentRef.nodeStartX,
      parentNodeYFrom: parentRef.nodeY,
      animationRequested: 1,
    }))
  } else if (mode === 'siblingDown') {
    parentRef = getMapData(m, lm.parentPath);
    parentRef.s.splice(lm.index + 1, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus > - 1 ? 0 : -1,
      parentNodeEndXFrom: parentRef.nodeEndX,
      parentNodeStartXFrom: parentRef.nodeStartX,
      parentNodeYFrom: parentRef.nodeY,
      animationRequested: 1,
    }));
  } else if (mode === 'child') {
    parentRef = lm.isRoot? lm.d[0] : lm;
    parentRef.s.splice(parentRef.s.length, 0, getDefaultNode({
      selected: 1,
      taskStatus: parentRef.taskStatus,
      parentNodeEndXFrom: parentRef.nodeEndX,
      parentNodeStartXFrom: parentRef.nodeStartX,
      parentNodeYFrom: parentRef.nodeY,
      animationRequested: 1,
    }));
  } else if (mode === 'childTable') {
    parentRef = lm.isRoot? lm.d[0] : lm;
    const tableGen = []
    const {rowLen, colLen} = payload
    for (let i = 0; i < rowLen; i++) {
      tableGen.push([])
      for (let j = 0; j < colLen; j++) {
        tableGen[i].push([])
        tableGen[i][j] = getDefaultNode({s: [getDefaultNode()]})
      }
    }
    parentRef.s.splice(parentRef.s.length, 0, getDefaultNode({
      selected: 1,
      taskStatus: -1,
      parentNodeEndXFrom: parentRef.nodeEndX,
      parentNodeStartXFrom: parentRef.nodeStartX,
      parentNodeYFrom: parentRef.nodeY,
      animationRequested: 1,
      c: tableGen
    }));
  }
}

export const cellInsert = (m, lastPath, key) => {
  let lm = getMapData(m, lastPath);
  let parentRef = getMapData(m, lm.parentPath);
  let currRow = lm.index[0];
  let currCol = lm.index[1];
  let rowLen = parentRef.c.length;
  let colLen = parentRef.c[0].length;
  let direction;
  if (        key === 'ArrowLeft' && lm.path[3] === 0 || key === 'ArrowRight' && lm.path[3] === 1) {  direction = 'in';
  } else if ( key === 'ArrowLeft' && lm.path[3] === 1 || key === 'ArrowRight' && lm.path[3] === 0) {  direction = 'out';
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
