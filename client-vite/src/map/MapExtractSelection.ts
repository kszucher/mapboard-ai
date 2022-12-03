// @ts-nocheck

import { arrayValuesSame } from '../core/Utils'
import { getMapData } from '../core/MapFlow'

export const mapExtractSelection = {
  start: (m, cr) => {
    mapExtractSelection.iterate(m, cr)
    const { sc } = m
    // indicators
    if (sc.structSelectedPathList.length && sc.cellSelectedPathList.length) {
      sc.lastPath = sc.structSelectedPathList[0];
      sc.geomHighPath = sc.lastPath;
      sc.geomLowPath = sc.lastPath;
    } else if (sc.structSelectedPathList.length) {
      for (let i = 0; i < sc.structSelectedPathList.length; i++) {
        let currSelectedNumber = getMapData(m, sc.structSelectedPathList[i]).selected;
        if (currSelectedNumber > sc.maxSel) {
          sc.maxSel = currSelectedNumber;
          sc.maxSelIndex = i;
        }
      }
      sc.lastPath = sc.structSelectedPathList[sc.maxSelIndex];
      sc.geomHighPath = sc.structSelectedPathList[0];
      sc.geomLowPath = sc.structSelectedPathList[sc.structSelectedPathList.length - 1];
    } else if (sc.cellSelectedPathList.length) {
      for (let i = 0; i < sc.cellSelectedPathList.length; i++) {
        let currSelectedNumber = getMapData(m, sc.cellSelectedPathList[i]).selected;
        if (currSelectedNumber > sc.maxSel) {
          sc.maxSel = currSelectedNumber;
          sc.maxSelIndex = i;
        }
      }
      sc.lastPath = sc.cellSelectedPathList[sc.maxSelIndex];
    } else {
      console.log('no selection');
      return;
    }
    // interrelations
    if (sc.structSelectedPathList.length && !sc.cellSelectedPathList.length) {
      [sc.haveSameParent, sc.sameParentPath] = arrayValuesSame(sc.structSelectedPathList.map(path => JSON.stringify(getMapData(m, path).parentPath)));
    } else if (!sc.structSelectedPathList.length && sc.cellSelectedPathList.length) {
      [sc.haveSameParent, sc.sameParentPath] = arrayValuesSame(sc.cellSelectedPathList.map(path => JSON.stringify(getMapData(m, path).parentPath)));
      if (sc.haveSameParent) {
        let [haveSameRow, sameRow] = arrayValuesSame(sc.cellSelectedPathList.map(path => path[path.length - 2]));
        let [haveSameCol, sameCol] = arrayValuesSame(sc.cellSelectedPathList.map(path => path[path.length - 1]));
        let sameParent = getMapData(m, sc.sameParentPath);
        if (haveSameRow && sc.cellSelectedPathList.length === sameParent.c[0].length) {
          sc.cellRowSelected = 1;
          sc.cellRow = sameRow;
        }
        if (haveSameCol && sc.cellSelectedPathList.length === sameParent.c.length) {
          sc.cellColSelected = 1;
          sc.cellCol = sameCol;
        }
      }
    }
    // scope
    if (sc.structSelectedPathList.length && sc.cellSelectedPathList.length) {
      sc.scope = 'm';
    } else if (sc.structSelectedPathList.length) {
      sc.scope = 's';
    } else if (sc.cellSelectedPathList.length) {
      sc.scope = 'c';
      if (sc.cellRowSelected) sc.scope = 'cr';
      if (sc.cellColSelected) sc.scope = 'cc';
    }
  },

  iterate: (m, cn) => {
    if (cn.animationRequested) {
      m.animationRequested = 1
    }
    if (cn.selected) {
      if (Number.isInteger(cn.path[cn.path.length - 2])) {
        m.sc.cellSelectedPathList.push(cn.path.slice(0)) // naturally ascending
      } else {
        m.sc.structSelectedPathList.push(cn.path.slice(0))
      }
    }
    cn.d.map(i => mapExtractSelection.iterate(m, i))
    cn.s.map(i => mapExtractSelection.iterate(m, i))
    cn.c.map(i => i.map(j => mapExtractSelection.iterate(m, j)))
  }
}
