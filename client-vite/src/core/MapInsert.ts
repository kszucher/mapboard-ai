import {GN, M, P} from "../state/MapPropTypes"
import {genHash, getTableIndices, IS_TESTING} from "./Utils"
import {unselectNodes} from "./MapSelect"
import {getXP, sortPath, makeSpaceFromS, getNodeByPath, makeSpaceFromCR, makeSpaceFromCC, getCountCH, getCountCV,} from "./MapUtils"

export const insertS = (m: M, ip: P, attributes: object) => {
  makeSpaceFromS(m, ip, 1)
  unselectNodes(m)
  m.push({selected: 1, selection: 's', nodeId: IS_TESTING ? 'z' : 'node' + genHash(8), path: ip, taskStatus: getNodeByPath(m, getXP(m)).taskStatus, ...attributes} as GN)
  m.sort(sortPath)
}

export const insertSL = (m: M, ip: P, payload: { gptParsed: string[] }) => {
  const { gptParsed } = payload
  makeSpaceFromS(m, ip, gptParsed.length)
  const newNodes = gptParsed.map((el: string, i: number) => ({
    nodeId: IS_TESTING ? 'z' : 'node' + genHash(8),
    path: [...ip.slice(0, -2), 's', ip.at(-1) as number + i],
    taskStatus: getNodeByPath(m, getXP(m)).taskStatus,
    content: el
  })) as GN[]
  m.push(...newNodes)
  m.sort(sortPath)
}

export const insertCR = (m: M, ip: P) => {
  makeSpaceFromCR(m, ip)
  const rowIndices = Array(getCountCH(m, getXP(m))).fill(null).map((el, i) => [ip.at(-2), i])
  unselectNodes(m)
  m.push(...rowIndices.map((el, i) => ({selected: 1, selection: 's', nodeId: IS_TESTING ? 'zc' + i : 'node' + genHash(8), path: [...ip.slice(0, -3), 'c', ...el]}  as GN)))
  m.push(...rowIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? 'zcs' + i : 'node' + genHash(8), path: [...ip.slice(0, -3), 'c', ...el,'s', 0]}  as GN)))
  m.sort(sortPath)
}

export const insertCC = (m: M, ip: P) => {
  makeSpaceFromCC(m, ip)
  const colIndices = Array(getCountCV(m, getXP(m))).fill(null).map((el, i) => [i, ip.at(-1)])
  unselectNodes(m)
  m.push(...colIndices.map((el, i) => ({selected: 1, selection: 's', nodeId: IS_TESTING ? 'zc' + i : 'node' + genHash(8), path: [...ip.slice(0, -3), 'c', ...el]}  as GN)))
  m.push(...colIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? 'zcs' + i : 'node' + genHash(8), path: [...ip.slice(0, -3), 'c', ...el,'s', 0]}  as GN)))
  m.sort(sortPath)
}

export const insertTable = (m: M, ip: P, payload: {rowLen: number, colLen: number}) => {
  makeSpaceFromS(m, ip, 1)
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  unselectNodes(m)
  m.push({selected: 1, selection: 's', nodeId: IS_TESTING ? 'z' : 'node' + genHash(8), path: ip} as GN)
  m.push(...tableIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? 'zc' + i : 'node' + genHash(8), path: [...ip, 'c', ...el]}  as GN)))
  m.push(...tableIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? 'zcs' + i : 'node' + genHash(8), path: [...ip, 'c', ...el,'s', 0]}  as GN)))
  m.sort(sortPath)
}
