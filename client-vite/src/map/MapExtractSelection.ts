import {getNodeByPath, getParentPath, isR} from "../core/MapUtils"
import {M} from "../state/MTypes"
import {G} from "../state/GPropsTypes"
import {copy, isArrayOfEqualValues} from "../core/Utils"

// TODO
// - introduce a new data structure that is written immediately without the collection step
// - scope is either s, f, c, cr or cc, and multi-select will only be possible in two ways: either multi-s or multi-f
// - prevent selecting nodes in an inclusive relation (cell struct inside cell with parent cell selected as well)

export const mapExtractSelection = (mlp: M) => {
  const g = getNodeByPath(mlp, ['g']) as G
  for (const n of mlp) {
    if (n.selected) {
      if (Number.isInteger(n.path[n.path.length - 2])) {
        g.sc.cellSelectedPathList.push(n.path.slice(0))
      } else {
        g.sc.structSelectedPathList.push(n.path.slice(0))
      }
    }
  }
  const { sc } = g
  // indicators
  if (sc.structSelectedPathList.length) {
    for (let i = 0; i < sc.structSelectedPathList.length; i++) {
      if (isR(sc.structSelectedPathList[i])) {
        sc.isRootIncluded = true
      }
    }
  }
  if (sc.structSelectedPathList.length && sc.cellSelectedPathList.length) {
    sc.lastPath = sc.structSelectedPathList[0]
    sc.geomHighPath = sc.lastPath
    sc.geomLowPath = sc.lastPath
  } else if (sc.structSelectedPathList.length) {
    for (let i = 0; i < sc.structSelectedPathList.length; i++) {
      let currSelectedNumber = getNodeByPath(mlp, sc.structSelectedPathList[i]).selected
      if (currSelectedNumber > sc.maxSel) {
        sc.maxSel = currSelectedNumber
        sc.maxSelIndex = i
      }
    }
    sc.lastPath = sc.structSelectedPathList[sc.maxSelIndex]
    sc.geomHighPath = sc.structSelectedPathList[0]
    sc.geomLowPath = sc.structSelectedPathList[sc.structSelectedPathList.length - 1]
  } else if (sc.cellSelectedPathList.length) {
    for (let i = 0; i < sc.cellSelectedPathList.length; i++) {
      let currSelectedNumber = getNodeByPath(mlp, sc.cellSelectedPathList[i]).selected
      if (currSelectedNumber > sc.maxSel) {
        sc.maxSel = currSelectedNumber
        sc.maxSelIndex = i
      }
    }
    sc.lastPath = sc.cellSelectedPathList[sc.maxSelIndex]
  } else {
    console.log('no selection')
    return
  }
  // interrelations
  if (sc.structSelectedPathList.length && !sc.cellSelectedPathList.length) {
    sc.haveSameParent = + isArrayOfEqualValues(sc.structSelectedPathList.map((path) => JSON.stringify(getNodeByPath(mlp, getParentPath(path)))))
    if (sc.haveSameParent) {
      sc.sameParentPath = copy(getParentPath(sc.lastPath))
    }
  } else if (!sc.structSelectedPathList.length && sc.cellSelectedPathList.length) {
    sc.haveSameParent = + isArrayOfEqualValues(sc.cellSelectedPathList.map((path) => JSON.stringify(getNodeByPath(mlp, getParentPath(path)))))
    if (sc.haveSameParent) {
      sc.sameParentPath = copy(getParentPath(sc.lastPath))
    }
    if (sc.haveSameParent) {
      let haveSameRow = isArrayOfEqualValues(sc.cellSelectedPathList.map((path) => path[path.length - 2]))
      let haveSameCol = isArrayOfEqualValues(sc.cellSelectedPathList.map((path) => path[path.length - 1]))
      let sameParent = getNodeByPath(mlp, sc.sameParentPath)
      if (haveSameRow && sc.cellSelectedPathList.length === sameParent.cColCount) {
        sc.isCellRowSelected = 1
        sc.cellRow = sc.cellSelectedPathList[0].at(-2) as number
      }
      if (haveSameCol && sc.cellSelectedPathList.length === sameParent.cRowCount) {
        sc.isCellColSelected = 1
        sc.cellCol = sc.cellSelectedPathList[0].at(-1) as number
      }
    }
  }
  // scope
  if (sc.structSelectedPathList.length) {
    sc.scope = 's'
  } else if (sc.cellSelectedPathList.length) {
    sc.scope = 'c'
    if (sc.isCellRowSelected) sc.scope = 'cr'
    if (sc.isCellColSelected) sc.scope = 'cc'
  }
}
