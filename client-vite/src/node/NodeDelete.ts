import {isEqual} from "../core/Utils";
import { getMapData } from '../core/MapFlow'

export const structDeleteReselect = (m: any, sc: any) => {
  let lm = getMapData(m, sc.lastPath);
  let crIndex = lm.path[1];
  for (let i = 0; i < sc.structSelectedPathList.length; i++) {
    let cn = getMapData(m, sc.structSelectedPathList[i]);
    if (cn.isRoot) return;
  }
  // calculate jump back
  let im = lm;
  for (let i = 0; i < sc.structSelectedPathList.length; i++) {
    let cn = getMapData(m, sc.structSelectedPathList[i]);
    if (cn.path.length < lm.path.length && isEqual(cn.path.slice(0, lm.path.length), lm.path)) {
      im = cn;
    }
  }
  let imParent = getMapData(m, im.parentPath);
  let imParentChildLen = imParent.s.length;
  let imParentChildDelLen = 0;
  for (let i = im.index; i > -1; i--) {
    if (imParent.s[i].selected > 0) {
      imParentChildDelLen++;
    }
  }
  // delete
  for (let i = sc.structSelectedPathList.length - 1; i > -1; i--) {
    let cn = getMapData(m, sc.structSelectedPathList[i]);
    let cmParent = getMapData(m, cn.parentPath);
    cmParent.taskStatus = cn.taskStatus;
    cmParent.s.splice(cn.index, 1);
  }
  // reselect on jumpback
  if (imParentChildLen === imParentChildDelLen) {
    if (imParent.isRootChild) {
      let cr = getMapData(m, ['r', crIndex]);
      cr.selected = 1;
    } else {
      imParent.selected = 1;
    }
  } else {
    if (im.index === 0) {
      if (imParent.s.length > 0) {
        imParent.s[0].selected = 1;
      } else {
        if (imParent.isRootChild) {
          let cr = getMapData(m, ['r', crIndex]);
          cr.selected = 1;
        } else {
          imParent.selected = 1;
        }
      }
    } else {
      if (im.index - imParentChildDelLen >= 0) {
        imParent.s[im.index - imParentChildDelLen].selected = 1;
      } else {
        imParent.s[0].selected = 1;
      }
    }
  }
}

export const cellBlockDeleteReselect = (m: any, sc: any) => {
  const {lastPath, cellRowSelected, cellRow, cellColSelected, cellCol, sameParentPath} = sc;
  let sameParent = getMapData(m, sameParentPath);
  let lm = getMapData(m, lastPath);
  if (cellRowSelected && getMapData(m, lm.parentPath).c.length === 1 ||
    cellColSelected && getMapData(m, lm.parentPath).c[0].length === 1) {
    let sameParentParent = getMapData(m, sameParent.parentPath);
    sameParentParent.s.splice(sameParent.index, 1);
    sameParentParent.selected = 1;
    return;
  }
  if (cellRowSelected) {
    sameParent.c.splice(cellRow, 1);
    sameParent.selected = 1;
  }
  if (cellColSelected) {
    for (let i = 0; i < sameParent.c.length; i++) {
      sameParent.c[i].splice(cellCol, 1);
    }
    sameParent.selected = 1;
  }
}
