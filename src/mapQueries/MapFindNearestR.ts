import { M, R } from "../mapState/MapStateTypes.ts"
import { mR } from "./MapQueries.ts"

const getDistanceBetweenPoints = (x1: number, y1: number, x2: number, y2: number) => {
  const dx = x2 - x1
  const dy = y2 - y1
  return Math.sqrt(dx * dx + dy * dy)
}

const getDistanceRR = (r1: R, r2: R) => getDistanceBetweenPoints(r1.nodeStartX + r1.selfW, r1.nodeStartY + r1.selfH / 2, r2.nodeStartX, r2.nodeStartY + r2.selfH / 2)
const getDistanceRL = (r1: R, r2: R) => getDistanceBetweenPoints(r1.nodeStartX, r1.nodeStartY + r1.selfH / 2, r2.nodeStartX + r2.selfW, r2.nodeStartY + r2.selfH / 2)
const getDistanceRD = (r1: R, r2: R) => getDistanceBetweenPoints(r1.nodeStartX + r1.selfW / 2, r1.nodeStartY + r1.selfH, r2.nodeStartX + r2.selfW / 2, r2.nodeStartY)
const getDistanceRU = (r1: R, r2: R) => getDistanceBetweenPoints(r1.nodeStartX + r1.selfW / 2, r1.nodeStartY, r2.nodeStartX + r2.selfW / 2, r2.nodeStartY + r2.selfH)

const getRAR = (m: M, xr: R) => mR(m).filter(ri => ri.nodeStartX > xr.nodeStartX + xr.selfW)
const getRAL = (m: M, xr: R) => mR(m).filter(ri => ri.nodeStartX + ri.selfW < xr.nodeStartX)
const getRAD = (m: M, xr: R) => mR(m).filter(ri => ri.nodeStartY > xr.nodeStartY + xr.selfH)
const getRAU = (m: M, xr: R) => mR(m).filter(ri => ri.nodeStartY + ri.selfH < xr.nodeStartY)

const getMinDistanceRR = (m: M, xr: R) => getRAR(m, xr).reduce((a, ri) => Math.min(...[getDistanceRR(xr, ri), a]), Infinity)
const getMinDistanceRL = (m: M, xr: R) => getRAL(m, xr).reduce((a, ri) => Math.min(...[getDistanceRL(xr, ri), a]), Infinity)
const getMinDistanceRD = (m: M, xr: R) => getRAD(m, xr).reduce((a, ri) => Math.min(...[getDistanceRD(xr, ri), a]), Infinity)
const getMinDistanceRU = (m: M, xr: R) => getRAU(m, xr).reduce((a, ri) => Math.min(...[getDistanceRU(xr, ri), a]), Infinity)

export const getRR = (m: M, xr: R) => mR(m).find(ri => getDistanceRR(xr, ri) === getMinDistanceRR(m, xr))
export const getLR = (m: M, xr: R) => mR(m).find(ri => getDistanceRL(xr, ri) === getMinDistanceRL(m, xr))
export const getDR = (m: M, xr: R) => mR(m).find(ri => getDistanceRD(xr, ri) === getMinDistanceRD(m, xr))
export const getUR = (m: M, xr: R) => mR(m).find(ri => getDistanceRU(xr, ri) === getMinDistanceRU(m, xr))

export const getClosestR = (m: M, xr: R) => getLR(m, xr) || getRR(m, xr) || getDR(m, xr) || getUR(m, xr) || mR(m).find(ri => ri.nodeId !== xr.nodeId)
