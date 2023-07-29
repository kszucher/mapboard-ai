import {GN, M, P} from "../state/MapPropTypes"
import {generateCharacter, genHash, getTableIndices, IS_TESTING} from "./Utils"
import {unselectNodes} from "./MapSelect"
import {getXP, sortPath, makeSpaceFromS, getNodeByPath, makeSpaceFromCR, makeSpaceFromCC, getSI1, getCountSCR, getCountSCC} from "./MapUtils"

export enum Templates {
  empty = 'Empty',
  detailedTeamBio = 'Detailed Team Bio',
  swot = 'SWOT',
}

export const insertTemplateR = (m: M, templateId: string, ri: number, offsetW: number, offsetH: number) => {
  unselectNodes(m)
  let template = [] as GN[]
  switch (templateId)  {
    case Templates.empty: {
      template = [
        {selected: 1, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,], content: "New Root"} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",1], content: ""} as GN
      ]
      break
    }
    case Templates.detailedTeamBio: {
      template = [
        {selected: 1, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,], content: "Detailed Team Bio"} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,0], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,1], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,1,"s",0], content: "Name"} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,2], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,2,"s",0], content: "Email"} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,3], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,3,"s",0], content: "LinkedIn"} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,4], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",0,4,"s",0], content: "Crunchbase"} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,0], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,0,"s",0], content: "Member"} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,1], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,2], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,3], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",0,"s",0,"c",1,4], content: ""} as GN,
        {selected: 0, selection: "s", nodeId: 'node' + genHash(8), path: ["r",ri,"d",1], content: ""} as GN
      ]
      break
    }
    case Templates.swot: {

      break
    }
  }
  template[0].offsetW = offsetW
  template[0].offsetH = offsetH
  m.push(...template)
  m.sort(sortPath)
}

export const insertS = (m: M, ip: P, attributes: object) => {
  makeSpaceFromS(m, ip, 1)
  unselectNodes(m)
  m.push({selected: 1, selection: 's', nodeId: IS_TESTING ? 't' : 'node' + genHash(8), path: ip, taskStatus: getNodeByPath(m, getXP(m)).taskStatus, ...attributes} as GN)
  m.sort(sortPath)
}

export const insertCR = (m: M, ip: P) => {
  const rowIndices = Array(getCountSCC(m, getSI1(ip))).fill(null).map((el, i) => [ip.at(-2), i])
  makeSpaceFromCR(m, ip)
  m.push(...rowIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8), path: [...ip.slice(0, -3), 'c', ...el]}  as GN)))
  m.sort(sortPath)
}

export const insertCC = (m: M, ip: P) => {
  const colIndices = Array(getCountSCR(m, getSI1(ip))).fill(null).map((el, i) => [i, ip.at(-1)])
  makeSpaceFromCC(m, ip)
  m.push(...colIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8), path: [...ip.slice(0, -3), 'c', ...el]}  as GN)))
  m.sort(sortPath)
}

export const insertTable = (m: M, ip: P, payload: {rowLen: number, colLen: number}) => {
  const tableIndices = getTableIndices(payload.rowLen, payload.colLen)
  makeSpaceFromS(m, ip, 1)
  unselectNodes(m)
  m.push({selected: 1, selection: 's', nodeId: IS_TESTING ? 't' : 'node' + genHash(8), path: ip} as GN)
  m.push(...tableIndices.map((el, i) => ({selected: 0, selection: 's', nodeId: IS_TESTING ? generateCharacter(i) : 'node' + genHash(8), path: [...ip, 'c', ...el]}  as GN)))
  m.sort(sortPath)
}
