import {getDefaultNode} from "../core/DefaultProps"
import { copy, transpose } from '../core/Utils'
import { getMapData } from '../core/MapFlow'

let clipboard: any[] = []

export const nodeMoveMouse = (m: any, sc: any, moveTargetPath: any, moveTargetIndex: any) => {
  let {structSelectedPathList, sameParentPath} = sc
  let sameParent = getMapData(m, sameParentPath)
  let moveSource = getMapData(m, structSelectedPathList[0])
  let moveTarget = getMapData(m, moveTargetPath)
  let tempClipboard = copy(moveSource)
  sameParent.s.splice(moveSource.index, 1)
  moveTarget.s.splice(moveTargetIndex, 0, tempClipboard)
}

export const nodeMove = (m: any, sc: any, target: any, key: any, mode: any) => {
  let {structSelectedPathList, lastPath, haveSameParent, sameParentPath,
    cellRowSelected, cellRow, cellColSelected, cellCol} = sc
  let lm = getMapData(m, lastPath)
  let direction = ''
  if (key === 'ArrowLeft' && lm.path[3] === 0 && haveSameParent && getMapData(m, sameParentPath).isRootChild ||
    key === 'ArrowRight' && lm.path[3] === 1 && haveSameParent && getMapData(m, sameParentPath).isRootChild) {
    direction = 'through'
  } else if (key === 'ArrowLeft' && lm.path[3] === 0 || key === 'ArrowRight' && lm.path[3] === 1) {
    direction = 'in'
  } else if (key === 'ArrowLeft' && lm.path[3] === 1 || key === 'ArrowRight' && lm.path[3] === 0) {
    direction = 'out'
  } else if (key === 'ArrowUp') {
    direction = 'up'
  } else if (key === 'ArrowDown') {
    direction = 'down'
  }
  if (target === 'struct2struct') {
    if (haveSameParent && !lm.isRoot) {
      let sameParent = getMapData(m, sameParentPath)
      if (direction === 'through') {
        let crIndex = lm.path[1]
        let cr = getMapData(m, ['r', crIndex])
        let dir = lm.path[3]
        let revDir = 1 - dir
        for (let i = structSelectedPathList.length - 1; i > -1; i--) {
          let currRef = getMapData(m, structSelectedPathList[i])
          sameParent.s.splice(currRef.index, 1)
          cr.d[revDir].s.splice(cr.d[revDir].s.length, 0, copy(currRef))
        }
      } else if (direction === 'in') {
        let sameParentParent = getMapData(m, sameParent.parentPath)
        for (let i = structSelectedPathList.length - 1; i > -1; i--) {
          let currRef = getMapData(m, structSelectedPathList[i])
          sameParent.s.splice(currRef.index, 1)
          sameParentParent.s.splice(sameParent.index + 1, 0, copy(currRef))
        }
      } else if (direction === 'out') {
        let geomHighRef = getMapData(m, sc.geomHighPath)
        if (geomHighRef.index > 0) {
          let upperSibling = sameParent.s[geomHighRef.index - 1]
          for (let i = structSelectedPathList.length - 1; i > -1; i--) {
            let currRef = getMapData(m, structSelectedPathList[i])
            sameParent.s.splice(currRef.index, 1)
            upperSibling.s.splice(upperSibling.s.length - structSelectedPathList.length + i + 1, 0, copy(currRef))
          }
        }
      } else if (direction === 'up') {
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
            sameParent.s.splice(sameParent.s.length - structSelectedPathList.length + i + 1, 0, copy(currRef))
          }
        }
      } else if (direction === 'down') {
        let geomLowRef = getMapData(m, sc.geomLowPath)
        if (geomLowRef.index !== sameParent.s.length - 1) {
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
    }
  } else if (target === 'struct2cell') {
    if (haveSameParent && !lm.isRoot) {
      let sameParent = getMapData(m, sameParentPath)
      let geomLowRef = getMapData(m, sc.geomLowPath)
      sameParent.s.splice(geomLowRef.index + 1, 0, getDefaultNode({}))
      let newCellRef = sameParent.s[geomLowRef.index + 1]
      if (mode === 'multiRow') {
        for (let i = structSelectedPathList.length - 1; i > -1; i--) {
          let currRef = getMapData(m, structSelectedPathList[i])
          newCellRef.c[0].push(getDefaultNode({s: [copy(currRef)]}))
          sameParent.s.splice(currRef.index, 1)
        }
        newCellRef.c = transpose([([].concat(...newCellRef.c))])
        newCellRef.c = newCellRef.c.reverse()
      }
    }
  } else if (target === 'cellBlock2CellBlock') {
    if (haveSameParent) {
      let sameParent = getMapData(m, sameParentPath)
      if (direction === 'up' && cellRowSelected && cellRow > 0) {
        [sameParent.c[cellRow], sameParent.c[cellRow - 1]] =
          [sameParent.c[cellRow - 1], sameParent.c[cellRow]]
      }
      if (direction === 'down' && cellRowSelected && cellRow < sameParent.c.length - 1) {
        [sameParent.c[cellRow], sameParent.c[cellRow + 1]] =
          [sameParent.c[cellRow + 1], sameParent.c[cellRow]]
      }
      if (direction === 'in' && cellColSelected && cellCol > 0) {
        for (let i = 0; i < sameParent.c.length; i++) {
          [sameParent.c[i][cellCol], sameParent.c[i][cellCol - 1]] =
            [sameParent.c[i][cellCol - 1], sameParent.c[i][cellCol]]
        }
      }
      if (direction === 'out' && cellColSelected && cellCol < sameParent.c[0].length - 1) {
        for (let i = 0; i < sameParent.c.length; i++) {
          [sameParent.c[i][cellCol], sameParent.c[i][cellCol + 1]] =
            [sameParent.c[i][cellCol + 1], sameParent.c[i][cellCol]]
        }
      }
    }
  } else if (target === 'struct2clipboard') {
    if (!lm.isRoot && (mode === 'CUT' || mode === 'COPY')) {
      clipboard = []
      for (let i = structSelectedPathList.length - 1; i > -1; i--) {
        let currRef = getMapData(m, structSelectedPathList[i])
        let currRefCopy = copy(currRef)
        clipboard.splice(0, 0, currRefCopy)
      }
      navigator.permissions.query(<PermissionDescriptor><unknown>{name: "clipboard-write"}).then(result => {
        if (result.state === "granted" || result.state === "prompt") {
          navigator.clipboard.writeText(JSON.stringify(clipboard, undefined, 4))
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
}
