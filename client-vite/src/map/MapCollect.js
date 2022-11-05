import { arrayValuesSame } from '../core/Utils'
import { mapref } from '../core/MapFlow'

export const mapCollect = {
  start: (m, cr) => {
    mapCollect.iterate(m, cr)
    const { sc } = m
    // indicators
    if (sc.structSelectedPathList.length && sc.cellSelectedPathList.length) {
      sc.lastPath = sc.structSelectedPathList[0];
      sc.geomHighPath = sc.lastPath;
      sc.geomLowPath = sc.lastPath;
    } else if (sc.structSelectedPathList.length) {
      for (let i = 0; i < sc.structSelectedPathList.length; i++) {
        let currSelectedNumber = mapref(m, sc.structSelectedPathList[i]).selected;
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
        let currSelectedNumber = mapref(m, sc.cellSelectedPathList[i]).selected;
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
      [sc.haveSameParent, sc.sameParentPath] = arrayValuesSame(sc.structSelectedPathList.map(path => JSON.stringify(mapref(m, path).parentPath)));
    } else if (!sc.structSelectedPathList.length && sc.cellSelectedPathList.length) {
      [sc.haveSameParent, sc.sameParentPath] = arrayValuesSame(sc.cellSelectedPathList.map(path => JSON.stringify(mapref(m, path).parentPath)));
      if (sc.haveSameParent) {
        let [haveSameRow, sameRow] = arrayValuesSame(sc.cellSelectedPathList.map(path => path[path.length - 2]));
        let [haveSameCol, sameCol] = arrayValuesSame(sc.cellSelectedPathList.map(path => path[path.length - 1]));
        let sameParent = mapref(m, sc.sameParentPath);
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

  iterate: (m, cm) => {
    if (cm.animationRequested) {
      m.animationRequested = 1
    }
    if (cm.selected) {
      if (Number.isInteger(cm.path[cm.path.length - 2])) {
        m.sc.cellSelectedPathList.push(cm.path.slice(0)) // naturally ascending
      } else {
        m.sc.structSelectedPathList.push(cm.path.slice(0))
      }
    }
    cm.d.map(i => mapCollect.iterate(m, i))
    cm.s.map(i => mapCollect.iterate(m, i))
    cm.c.map(i => i.map(j => mapCollect.iterate(m, j)))
  }
}
