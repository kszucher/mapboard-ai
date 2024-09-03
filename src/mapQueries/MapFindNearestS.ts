import {M} from "../state/MapStateTypes"
import {getXS, mS} from "./MapQueries.ts"

export const mapFindNearestS = (pm: M, toX: number, toY: number): {sMoveCoords: number[], sL: string, sU: string, sD: string} => {
  const xs = getXS(pm)
  let sMoveCoords = [] as number[]
  let sL = ''
  let sU = ''
  let sD = ''
  if (xs.nodeStartX >= toX || toX >= xs.nodeStartX + xs.selfW || xs.nodeStartY >= toY || toY >= xs.nodeStartY + xs.selfH) {
    let nearestLeftS = null
    let nearestDistance = Infinity
    for (const s of mS(pm)) {
      if (![xs, ...xs.so].includes(s)) {
        const compareX = s.nodeStartX + s.selfW
        const compareY = s.nodeStartY + s.selfH / 2
        if (compareX < toX) {
          const distance = Math.sqrt(Math.pow(toX - compareX, 2) + Math.pow(toY - compareY, 2))
          if (distance < nearestDistance) {
            nearestLeftS = s
            nearestDistance = distance
          }
        }
      }
    }
    if (nearestLeftS) {
      sMoveCoords = [nearestLeftS.nodeStartX + nearestLeftS.selfW, nearestLeftS.nodeStartY + nearestLeftS.selfH / 2, toX, toY]
      sL = nearestLeftS.nodeId
      sU = nearestLeftS.so1.filter(si => si !== xs)?.findLast(si => si.nodeStartY + si.selfH < toY)?.nodeId ?? ''
      sD = nearestLeftS.so1.filter(si => si !== xs)?.find(si => si.nodeStartY > toY)?.nodeId ?? ''
    }
  }
  return {sMoveCoords, sL, sU, sD}
}
