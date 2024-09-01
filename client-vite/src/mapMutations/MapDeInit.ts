import {M} from "../state/MapStateTypes"
import {gSaveAlways, gSaveOptional, lSaveAlways, lSaveOptional, rSaveAlways, rSaveOptional, sSaveAlways, sSaveOptional, cSaveAlways, cSaveOptional} from "../state/MapState"
import {sortNode} from "./MapSort.ts"
import {mG, mL, mR, mS, mC} from "../mapQueries/MapQueries.ts"
import {filterObject, getNonDefaultObjectKeys} from "../utils/Utils.ts"

export const mapDeInit = (m: M) => {
  return ([
    ...mG(m).map(gi => ({...filterObject(gi, [...Object.keys(gSaveAlways), ...getNonDefaultObjectKeys(filterObject(gi, Object.keys(gSaveOptional)), gSaveOptional)])})),
    ...mL(m).map(li => ({...filterObject(li, [...Object.keys(lSaveAlways), ...getNonDefaultObjectKeys(filterObject(li, Object.keys(lSaveOptional)), lSaveOptional)])})),
    ...mR(m).map(ri => ({...filterObject(ri, [...Object.keys(rSaveAlways), ...getNonDefaultObjectKeys(filterObject(ri, Object.keys(rSaveOptional)), rSaveOptional)])})),
    ...mS(m).map(si => ({...filterObject(si, [...Object.keys(sSaveAlways), ...getNonDefaultObjectKeys(filterObject(si, Object.keys(sSaveOptional)), sSaveOptional)])})),
    ...mC(m).map(ci => ({...filterObject(ci, [...Object.keys(cSaveAlways), ...getNonDefaultObjectKeys(filterObject(ci, Object.keys(cSaveOptional)), cSaveOptional)])}))
  ] as M).sort(sortNode)
}
