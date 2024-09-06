import {M} from "../state/MapStateTypes"
import {gSaveAlways, gSaveOptional, lSaveAlways, lSaveOptional, rSaveAlways, rSaveOptional, sSaveAlways, sSaveOptional, cSaveAlways, cSaveOptional} from "../state/MapState"
import {sortNode} from "./MapSort.ts"
import {mG, mL, mR, mS, mC} from "../mapQueries/MapQueries.ts"
import {includeKeys, getNonDefaultObjectKeys} from "../utils/Utils.ts"

export const mapDeInit = (m: M) => {
  return ([
    ...mG(m).map(gi => ({...includeKeys(gi, [...Object.keys(gSaveAlways), ...getNonDefaultObjectKeys(includeKeys(gi, Object.keys(gSaveOptional)), gSaveOptional)])})),
    ...mL(m).map(li => ({...includeKeys(li, [...Object.keys(lSaveAlways), ...getNonDefaultObjectKeys(includeKeys(li, Object.keys(lSaveOptional)), lSaveOptional)])})),
    ...mR(m).map(ri => ({...includeKeys(ri, [...Object.keys(rSaveAlways), ...getNonDefaultObjectKeys(includeKeys(ri, Object.keys(rSaveOptional)), rSaveOptional)])})),
    ...mS(m).map(si => ({...includeKeys(si, [...Object.keys(sSaveAlways), ...getNonDefaultObjectKeys(includeKeys(si, Object.keys(sSaveOptional)), sSaveOptional)])})),
    ...mC(m).map(ci => ({...includeKeys(ci, [...Object.keys(cSaveAlways), ...getNonDefaultObjectKeys(includeKeys(ci, Object.keys(cSaveOptional)), cSaveOptional)])}))
  ] as M).sort(sortNode)
}
