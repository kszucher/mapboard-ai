import {ccToCb, crToCb, getCountNSCH, getCountNSCV, getCountXASU, getReselectS, getXA, getXSI1, makeSpaceFromCc, makeSpaceFromCr, makeSpaceFromS, rToCb, sortPath, sToCb} from "../selectors/MapSelectorUtils"
import {M, N, P} from "../state/MapStateTypes"
import {generateCharacter, genHash, IS_TESTING} from "../utils/Utils"
import {mapDeInit} from "./MapDeInit"
import {deleteCC, deleteCR, deleteS} from "./MapDelete"
import {insertTable} from "./MapInsert"
import {selectNode, selectNodeList, unselectNodes} from "./MapSelect"

const formatCb = (arr: any[]) => "[\n" + arr.map((e: any) => '  ' + JSON.stringify(e)).join(',\n') + "\n]"

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
        .writeText(formatCb(cb))
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
  // const cb = sToCb(m) as M
  // cbSave(cb)
  // deleteR(m)
  // selectNode(m, reselect, 's')
}

export const cutS = (m: M) => {
  const reselect = getReselectS(m)
  const cb = sToCb(m)
  cbSave(cb)
  deleteS(m)
  selectNode(m, reselect, 's')
}

export const copyR = (m: M) => {
  const cb = rToCb(m)
  const cbDeInit = mapDeInit(cb)
  cbSave(cbDeInit)
}

export const copyS = (m: M) => {
  const cb = sToCb(m)
  const cbDeInit = mapDeInit(cb)
  cbSave(cbDeInit)
}

export const pasteS = (m: M, insertParentNode: N, insertTargetIndex: number, payload: any) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  const cb = JSON.parse(payload) as M
  cb.forEach(n => Object.assign(n, {nodeId: 'node' + genHash(8)}))
  unselectNodes(m)
  makeSpaceFromS(m, ip, getXA(cb).length)
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 's', (n.path.at(1) as number) + insertTargetIndex, ...n.path.slice(2)]})) as M)
  m.sort(sortPath)
}

export const pasteR = (m: M) => {

}

export const duplicateS = (m: M) => {
  const insertParentNode = getXSI1(m)
  const insertTargetIndex = getCountXASU(m) + getXA(m).length
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  const cb = sToCb(m)
  unselectNodes(m)
  makeSpaceFromS(m, ip, getXA(cb).length)
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
  // const cb = sToCb(m)
  // cb.forEach((n, i) => Object.assign(n, {nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8)}))
  // unselectNodes(m)
  // makeSpaceFromS(m, ip, getXA(cb).length)
  // m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 's', (n.path.at(1) as number) + insertTargetIndex, ...n.path.slice(2)]})) as M) // nid assign?
  // m.sort(sortPath)

}

export const moveS = (m: M, insertParentNode: N, insertTargetIndex: number) => {
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  const cb = sToCb(m)
  deleteS(m)
  makeSpaceFromS(m, ip, getXA(cb).length)
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 's', (n.path.at(1) as number) + insertTargetIndex, ...n.path.slice(2)]})) as M)
  m.sort(sortPath)
}

export const moveCR = (m: M, insertParentNode: N, insertTargetRowIndex: number) => {
  const ipList = Array(getCountNSCH(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', insertTargetRowIndex, i] as P)
  const cb = crToCb(m)
  deleteCR(m)
  makeSpaceFromCr(m, ipList, 1)
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 'c', (n.path.at(1) as number) + insertTargetRowIndex, (n.path.at(2) as number), ...n.path.slice(3)]})) as M)
  m.sort(sortPath)
}

export const moveCC = (m: M, insertParentNode: N, insertTargetColumnIndex: number) => {
  const ipList = Array(getCountNSCV(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', i, insertTargetColumnIndex] as P)
  const cb = ccToCb(m)
  deleteCC(m)
  makeSpaceFromCc(m, ipList, 1)
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 'c', (n.path.at(1) as number), (n.path.at(2) as number) + insertTargetColumnIndex, ...n.path.slice(3)]})) as M)
  m.sort(sortPath)
}

export const moveS2T = (m: M, insertParentNode: N, moveNodes: N[]) => {
  const rowLen = moveNodes.length
  selectNodeList(m, moveNodes, 's')
  const cb = sToCb(m)
  deleteS(m)
  insertTable(m, insertParentNode, 0, {rowLen, colLen: 1})
  cb.forEach(n => Object.assign(n, {selected: 0, path: [...insertParentNode.path, 's', 0, 'c', n.path.at(1), 0, 's', 0, ...n.path.slice(2)] as P}))
  m.push(...cb)
  m.sort(sortPath)
}
