import {mapDeInit} from "./MapDeInit";
import {insertTable} from "./MapInsert"
import {genHash} from "./Utils"
import {M, N, P} from "../state/MapStateTypes"
import {deleteCC, deleteCR, deleteS} from "./MapDelete"
import {selectNode, selectNodeList, unselectNodes} from "./MapSelect"
import {getReselectS, getXA, m2cbS, sortPath, m2cbR, isNCED, getCountNSCH, getXAF, getXP, getCountXCU, getCountXCL, getCountNSCV, isNCER, isSFDF} from "./MapUtils"

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

export const cutS = (m: M) => {
  const reselectPath = getReselectS(m)
  const cb = m2cbS(m)
  cbSave(cb)
  deleteS(m)
  selectNode(m, reselectPath, 's')
}

export const copyR = (m: M) => {
  const cb = m2cbR(m)
  showTemplate(cb)
  // const cbDeInit = mapDeInit(cb)
  // cbSave(cbDeInit)
  // TODO uncomment these when paste can detect and load R
}

export const copyS = (m: M) => {
  const cb = m2cbS(m)
  showTemplate(cb)
  const cbDeInit = mapDeInit(cb)
  cbSave(cbDeInit)
}

export const pasteS = (m: M, insertParentNode: N, insertTargetIndex: number, payload: any) => {
  const cb = JSON.parse(payload) as M
  cb.forEach(n => Object.assign(n, {nodeId: 'node' + genHash(8)}))
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  unselectNodes(m)
  m.forEach(n => isSFDF(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + getXA(cb).length))
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 's', (n.path.at(1) as number) + insertTargetIndex, ...n.path.slice(2)]})) as M)
  m.sort(sortPath)
}

export const moveS = (m: M, insertParentNode: N, insertTargetIndex: number) => {
  const cb = m2cbS(m)
  deleteS(m)
  const ip = [...insertParentNode.path, 's', insertTargetIndex] as P
  m.forEach(n => isSFDF(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + getXA(cb).length))
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 's', (n.path.at(1) as number) + insertTargetIndex, ...n.path.slice(2)]})) as M)
  m.sort(sortPath)
}

export const moveCR = (m: M, insertParentNode: N, insertTargetRowIndex: number) => {
  const cb = getXAF(m).map(n => ({...n, path: ['c', (n.path.at(getXP(m).length - 2) as number) - getCountXCU(m), n.path.at(getXP(m).length - 1), ...n.path.slice(getXP(m).length)]})) as M
  deleteCR(m)
  const insertPathList = Array(getCountNSCH(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', insertTargetRowIndex, i] as P)
  m.forEach(n => insertPathList.map(ip => isNCED(ip, n.path) && n.path.splice(ip.length - 2, 1, n.path.at(ip.length - 2) as number + 1)))
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 'c', (n.path.at(1) as number) + insertTargetRowIndex, (n.path.at(2) as number), ...n.path.slice(3)]})) as M)
  m.sort(sortPath)
}

export const moveCC = (m: M, insertParentNode: N, insertTargetColumnIndex: number) => {
  const cb = getXAF(m).map(n => ({...n, path: ['c', (n.path.at(getXP(m).length - 2) as number), (n.path.at(getXP(m).length - 1) as number) - getCountXCL(m), ...n.path.slice(getXP(m).length)]})) as M
  deleteCC(m)
  const insertPathList = Array(getCountNSCV(m, insertParentNode)).fill(null).map((el, i) => [...insertParentNode.path, 'c', i, insertTargetColumnIndex] as P)
  m.forEach(n => insertPathList.map(ip => isNCER(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + 1)))
  m.push(...cb.map(n => ({...n, path: [...insertParentNode.path, 'c', (n.path.at(1) as number), (n.path.at(2) as number) + insertTargetColumnIndex, ...n.path.slice(3)]})) as M)
  m.sort(sortPath)
}

export const moveS2T = (m: M, insertParentNode: N, moveNodes: N[]) => {
  const rowLen = moveNodes.length
  selectNodeList(m, moveNodes.map(n => n.path), 's')
  const cb = m2cbS(m)
  deleteS(m)
  insertTable(m, insertParentNode, 0, {rowLen, colLen: 1})
  cb.forEach(n => Object.assign(n, {
    selected: 0,
    selection: 's',
    path: [...insertParentNode.path, 's', 0, 'c', n.path.at(1), 0, 's', 0, ...n.path.slice(2)] as P
  }))
  m.push(...cb)
  m.sort(sortPath)
}
