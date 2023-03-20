import {getDefaultNode} from "../core/DefaultProps"
import {copy, transpose} from '../core/Utils'
import {getMapData} from '../map/MapReducer'
import {Dir} from "../core/Enums"
import {M} from "../state/MTypes"

export const nodeMoveMouse = (m: any, sc: any, moveTargetPath: any, moveTargetIndex: any) => {
  let {structSelectedPathList, sameParentPath} = sc
  let sameParent = getMapData(m, sameParentPath)
  let moveSource = getMapData(m, structSelectedPathList[0])
  let moveTarget = getMapData(m, moveTargetPath)
  let tempClipboard = copy(moveSource)
  sameParent.s.splice(moveSource.index, 1)
  moveTarget.s.splice(moveTargetIndex, 0, tempClipboard)
}

export const structMove = (m: any, target: any, direction?: Dir) => {
  console.log(m)
  const { sc } = m.g
  const  { structSelectedPathList, lastPath, sameParentPath } = sc
  let ln = getMapData(m, lastPath)
  if (target === 'struct2struct') {
    let sameParent = getMapData(m, sameParentPath)
    if (direction === Dir.IR || direction === Dir.IL) {
      let dir = ln.path[3]
      let revDir = 1 - dir
      for (let i = structSelectedPathList.length - 1; i > -1; i--) {
        let currRef = getMapData(m, structSelectedPathList[i])
        sameParent.s.splice(currRef.index, 1)
        m.r[0].d[revDir].s.splice(m.r[0].d[revDir].sCount, 0, copy(currRef)) // TODO assign OR splice
      }
    } else if (direction === Dir.I) {
      let sameParentParent = getMapData(m, sameParent.parentPath)
      for (let i = structSelectedPathList.length - 1; i > -1; i--) {
        let currRef = getMapData(m, structSelectedPathList[i])
        sameParent.s.splice(currRef.index, 1)
        sameParentParent.s.splice(sameParent.index + 1, 0, copy(currRef))
      }
    } else if (direction === Dir.O) {
      let geomHighRef = getMapData(m, sc.geomHighPath)
      if (geomHighRef.index > 0) {
        let upperSibling = sameParent.s[geomHighRef.index - 1]
        for (let i = structSelectedPathList.length - 1; i > -1; i--) {
          let currRef = getMapData(m, structSelectedPathList[i])
          sameParent.s.splice(currRef.index, 1)
          upperSibling.s.splice(upperSibling.sCount - structSelectedPathList.length + i + 1, 0, copy(currRef))
        }
      }
    } else if (direction === Dir.U) {
      let geomHighRef = getMapData(m, sc.geomHighPath)
      if (geomHighRef.index > 0) {
        for (let i = 0; i < structSelectedPathList.length; i++) {
          let currRef = getMapData(m, structSelectedPathList[i])
          sameParent.s.splice(currRef.index, 1)
          sameParent.s.splice(currRef.index - 1, 0, copy(currRef))
        }
      } else {
        for (let i = structSelectedPathList.length - 1; i > -1; i--) {
          let currRef = getMapData(m, structSelectedPathList[i])
          sameParent.s.splice(currRef.index, 1)
          sameParent.s.splice(sameParent.sCount - structSelectedPathList.length + i + 1, 0, copy(currRef))
        }
      }
    } else if (direction === Dir.D) {
      let geomLowRef = getMapData(m, sc.geomLowPath)
      if (geomLowRef.index !== sameParent.sCount - 1) {
        for (let i = structSelectedPathList.length - 1; i > -1; i--) {
          let currRef = getMapData(m, structSelectedPathList[i])
          sameParent.s.splice(currRef.index, 1)
          sameParent.s.splice(currRef.index + 1, 0, copy(currRef))
        }
      } else {
        for (let i = 0; i < structSelectedPathList.length; i++) {
          let currRef = getMapData(m, structSelectedPathList[i])
          sameParent.s.splice(currRef.index, 1)
          sameParent.s.splice(i, 0, copy(currRef))
        }
      }
    }
  } else if (target === 'struct2cell') {
    let sameParent = getMapData(m, sameParentPath)
    let geomLowRef = getMapData(m, sc.geomLowPath)
    sameParent.s.splice(geomLowRef.index + 1, 0, getDefaultNode({}))
    let newCellRef = sameParent.s[geomLowRef.index + 1]
    for (let i = structSelectedPathList.length - 1; i > -1; i--) {
      let currRef = getMapData(m, structSelectedPathList[i])
      newCellRef.c[0].push(getDefaultNode({s: [copy(currRef)]}))
      sameParent.s.splice(currRef.index, 1)
    }
    newCellRef.c = transpose([([].concat(...newCellRef.c))])
    newCellRef.c = newCellRef.c.reverse()
  } else if (target === 'struct2clipboard') {
    let clipboard: any[] = []
    for (let i = structSelectedPathList.length - 1; i > -1; i--) {
      let currRef = getMapData(m, structSelectedPathList[i])
      let currRefCopy = copy(currRef)
      clipboard.splice(0, 0, currRefCopy)
    }
    navigator.permissions.query(<PermissionDescriptor><unknown>{name: "clipboard-write"}).then(result => {
      if (result.state === "granted" || result.state === "prompt") {
        navigator.clipboard
          .writeText(JSON.stringify(clipboard, undefined, 4))
          .then(() => {
            console.log('map copied to clipboard')
          })
          .catch(err => {
            console.error('could not copy text: ', err)
          })
      }
    })
  }
}

export const cellRowMove = (m: M, direction: Dir) => {
  const { sc } = m.g
  const  { sameParentPath, isCellRowSelected, cellRow } = sc
  let sameParent = getMapData(m, sameParentPath)
  if (direction === Dir.U && isCellRowSelected && cellRow > 0) {
    [sameParent.c[cellRow], sameParent.c[cellRow - 1]] =
      [sameParent.c[cellRow - 1], sameParent.c[cellRow]]
  }
  if (direction === Dir.D && isCellRowSelected && cellRow < sameParent.c.length - 1) {
    [sameParent.c[cellRow], sameParent.c[cellRow + 1]] =
      [sameParent.c[cellRow + 1], sameParent.c[cellRow]]
  }
}

export const cellColMove = (m: M, direction: Dir) => {
  const { sc } = m.g
  const  { sameParentPath, isCellColSelected, cellCol } = sc
  let sameParent = getMapData(m, sameParentPath)
  if (direction === Dir.I && isCellColSelected && cellCol > 0) {
    for (let i = 0; i < sameParent.c.length; i++) {
      [sameParent.c[i][cellCol], sameParent.c[i][cellCol - 1]] = [sameParent.c[i][cellCol - 1], sameParent.c[i][cellCol]]
    }
  }
  if (direction === Dir.O && isCellColSelected && cellCol < sameParent.c[0].length - 1) {
    for (let i = 0; i < sameParent.c.length; i++) {
      [sameParent.c[i][cellCol], sameParent.c[i][cellCol + 1]] =
        [sameParent.c[i][cellCol + 1], sameParent.c[i][cellCol]]
    }
  }
}
