import isEqual from "react-fast-compare";
import {mapDeInit} from "./MapDeInit";
import {insertTable} from "./MapInsert"
import {generateCharacter, genHash, IS_TESTING} from "../utils/Utils"
import {M, N, P} from "../state/MapStateTypes"
import {deleteCC, deleteCR, deleteS} from "./MapDelete"
import {selectNode, selectNodeList, unselectNodes} from "./MapSelect"
import {getReselectS, getXA, sortPath, isCED, getCountNSCH, getXAEO, getX, getCountXCU, getCountXCL, getCountNSCV, isCER, isSEODO, getCountXASU, getXSI1, isSEO, getXSF, sortNode} from "../selectors/MapSelectorUtils"

const templateReady = (arr: any[]) => "[\n" + arr.map((e: any) => '  ' + JSON.stringify(e)).join(',\n') + "\n]"

const showTemplate = (m: M) => {
  console.log(
    '' + m.map(n => ('\n{' +
      'selected: ' + JSON.stringify(n.selected) + ', ' +
      'selection: ' + JSON.stringify(n.selection) + ', ' +
      `nodeId: 'node' + genHash(8)` + ', ' +
      `path: ["r",ri,${JSON.stringify(n.path.slice(2)).slice(1, -1)}]` + ', ' +
      'content: ' + JSON.stringify(n.content) + ', ' +
      'sFillColor: ' + JSON.stringify(n.sFillColor) +
      '} as GN'
    ))
  )
}

const cbSave = (cb: any) => {
  navigator.permissions.query(<PermissionDescriptor><unknown>{name: "clipboard-write"}).then(result => {
    if (result.state === "granted" || result.state === "prompt") {
      navigator.clipboard
        .writeText(templateReady(cb))
        .then(() => {
          console.log('moved to clipboard')
        })
        .catch(err => {
          console.error('move to clipboard error: ', err)
        })
    }
  })
}

export const cutR = (m: M) => {
  // const reselect = getReselectR(m)
  // const cb = getXAEO(m).map(n => ({...n, path: ['s', (n.path.at(getX(m).path.length - 1) as number) - getCountXASU(m), ...n.path.slice(getX(m).path.length)]})) as M
  // cbSave(cb)
  // deleteR(m)
  // selectNode(m, reselect, 's')
}

export const cutS = (m: M) => {
  const reselect = getReselectS(m)
  const cb = getXAEO(m).map(n => ({...n, path: ['s', (n.path.at(getX(m).path.length - 1) as number) - getCountXASU(m), ...n.path.slice(getX(m).path.length)]})) as M
  cbSave(cb)
  deleteS(m)
  selectNode(m, reselect, 's')
}

export const copyR = (m: M) => {
  const cb = getXAEO(m).map(n => ({...n, path: ['r', (n.path.at(getX(m).path.length - 1) as number), ...n.path.slice(getX(m).path.length)]})) as M
  const cbDeInit = mapDeInit(cb)
  cbSave(cbDeInit)
}

export const copyS = (m: M) => {
  const cb = getXAEO(m).map(n => ({...n, path: ['s', (n.path.at(getX(m).path.length - 1) as number) - getCountXASU(m), ...n.path.slice(getX(m).path.length)]})) as M
  const cbDeInit = mapDeInit(cb)
  cbSave(cbDeInit)
}

export const pasteS = (m: M, insertParentNode: N, insertTargetIndex: number, payload: any) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  const cb = JSON.parse(payload) as M
  cb.forEach(n => Object.assign(n, {nodeId: 'node' + genHash(8)}))
  unselectNodes(m)
  m.forEach(n => isSEODO(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + getXA(cb).length))
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 's', (n.path.at(1) as number) + insertTargetIndex, ...n.path.slice(2)]})) as M)
  m.sort(sortPath)
}

export const pasteR = (m: M) => {

}

export const duplicateS = (m: M) => {
  const insertParentNode = getXSI1(m)
  const insertTargetIndex = getCountXASU(m) + getXA(m).length
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  const cb = getXAEO(m).map(n => ({...n, path: ['s', (n.path.at(getX(m).path.length - 1) as number) - getCountXASU(m), ...n.path.slice(getX(m).path.length)]})) as M
  unselectNodes(m)
  m.forEach(n => isSEODO(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + getXA(cb).length))
  m.push(...cb.map((n, i) => ({...n,
    nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8),
    path: [...insertParentNode.path, 's', (n.path.at(1) as number) + insertTargetIndex, ...n.path.slice(2)]
  })) as M)
  m.sort(sortPath)
}

export const duplicateR = (m: M) => {
  // // TODO this, then the atomic copy-paste (using isRDO, etc.)
  //
  // const insertParentNode = getXSI1(m)
  // const insertTargetIndex = getCountXASU(m) + getXA(m).length
  // const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  // const cb = getXAEO(m).map(n => ({...n, path: ['s', (n.path.at(getX(m).path.length - 1) as number) - getCountXASU(m), ...n.path.slice(getX(m).path.length)]})) as M
  // cb.forEach((n, i) => Object.assign(n, {nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8)}))
  // unselectNodes(m)
  // m.forEach(n => isSEODO(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + getXA(cb).length))
  // m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 's', (n.path.at(1) as number) + insertTargetIndex, ...n.path.slice(2)]})) as M) // nid assign?
  // m.sort(sortPath)

}

export const moveS = (m: M, insertParentNode: N, insertTargetIndex: number) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  const cb = getXAEO(m).map(n => ({...n, path: ['s', (n.path.at(getX(m).path.length - 1) as number) - getCountXASU(m), ...n.path.slice(getX(m).path.length)]})) as M
  deleteS(m)
  m.forEach(n => isSEODO(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + getXA(cb).length))
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 's', (n.path.at(1) as number) + insertTargetIndex, ...n.path.slice(2)]})) as M)
  m.sort(sortPath)
}

// export const moveS = (m: M, insertParentNode: N, insertTargetIndex: number) => {
//   const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
//   const xaLength = getXA(m).length
//   m.splice(0, m.length, ... [
//     ...m.filter(n =>!getXA(m).some(xn => isSEODO(xn.path, n.path)) && !isSEODO(ip, n.path)),
//     ...m.filter(n =>
//       isEqual(n.path.slice(0, ip.length - 1), ip.slice(0, -1)) &&
//       (n.path.at(ip.length - 1) as number) >= (insertTargetIndex + xaLength) &&
//       (n.path.at(ip.length - 1) as number) >= (getXSF(m).path.at(-1) as number + xaLength)
//     ),
//     ...m.filter(n =>
//       getXA(m).some(xn => isSEO(xn.path, n.path))
//     ).map(n => ({...n, path: [...insertParentNode.path, 's', (n.path.at(getX(m).path.length - 1) as number) - getCountXASU(m) + insertTargetIndex, ...n.path.slice(getX(m).path.length)] as P})),
//     ...m.filter(n =>
//       isEqual(n.path.slice(0, ip.length - 1), ip.slice(0, -1)) &&
//       (n.path.at(ip.length - 1) as number) >= (getXSF(m).path.at(-1) as number + xaLength) &&
//       (n.path.at(ip.length - 1) as number) < insertTargetIndex + xaLength
//     ).map(n => ({...n, path: [...insertParentNode.path, 's', (n.path.at(ip.length - 1) as number) - xaLength, ...n.path.slice(ip.length)] as P})),
//     ...m.filter(n =>
//       isEqual(n.path.slice(0, ip.length - 1), ip.slice(0, -1)) &&
//       (n.path.at(ip.length - 1) as number) < (getXSF(m).path.at(-1) as number) &&
//       (n.path.at(ip.length - 1) as number) >= insertTargetIndex
//     ).map(n => ({...n, path: [...insertParentNode.path, 's', (n.path.at(ip.length - 1) as number) + xaLength, ...n.path.slice(ip.length)] as P}))
//   ])
//   m.sort(sortPath)
//   console.log(m.slice().sort(sortNode).map(el =>el.nodeId))
// }

export const moveCR = (m: M, insertParentNode: N, insertTargetRowIndex: number) => {
  const ipList = Array(getCountNSCH(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', insertTargetRowIndex, i] as P)
  const cb = getXAEO(m).map(n => ({...n, path: ['c', (n.path.at(getX(m).path.length - 2) as number) - getCountXCU(m), n.path.at(getX(m).path.length - 1), ...n.path.slice(getX(m).path.length)]})) as M
  deleteCR(m)
  m.forEach(n => ipList.map(ip => isCED(ip, n.path) && n.path.splice(ip.length - 2, 1, n.path.at(ip.length - 2) as number + 1)))
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 'c', (n.path.at(1) as number) + insertTargetRowIndex, (n.path.at(2) as number), ...n.path.slice(3)]})) as M)
  m.sort(sortPath)
}

export const moveCC = (m: M, insertParentNode: N, insertTargetColumnIndex: number) => {
  const ipList = Array(getCountNSCV(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', i, insertTargetColumnIndex] as P)
  const cb = getXAEO(m).map(n => ({...n, path: ['c', (n.path.at(getX(m).path.length - 2) as number), (n.path.at(getX(m).path.length - 1) as number) - getCountXCL(m), ...n.path.slice(getX(m).path.length)]})) as M
  deleteCC(m)
  m.forEach(n => ipList.map(ip => isCER(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + 1)))
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 'c', (n.path.at(1) as number), (n.path.at(2) as number) + insertTargetColumnIndex, ...n.path.slice(3)]})) as M)
  m.sort(sortPath)
}

export const moveS2T = (m: M, insertParentNode: N, moveNodes: N[]) => {
  const rowLen = moveNodes.length
  selectNodeList(m, moveNodes, 's')
  const cb = getXAEO(m).map(n => ({...n, path: ['s', (n.path.at(getX(m).path.length - 1) as number) - getCountXASU(m), ...n.path.slice(getX(m).path.length)]})) as M
  deleteS(m)
  insertTable(m, insertParentNode, 0, {rowLen, colLen: 1})
  cb.forEach(n => Object.assign(n, {selected: 0, path: [...insertParentNode.path, 's', 0, 'c', n.path.at(1), 0, 's', 0, ...n.path.slice(2)] as P}))
  m.push(...cb)
  m.sort(sortPath)
}
