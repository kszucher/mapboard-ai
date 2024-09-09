import {M} from "../mapState/MapStateTypes.ts"
import {gSaveAlways, gSaveOptional, lSaveAlways, lSaveOptional, rSaveAlways, rSaveOptional, sSaveAlways, sSaveOptional, cSaveAlways, cSaveOptional} from "../mapState/MapState.ts"
import {sortNode} from "../mapMutations/MapSort.ts"
import {mG, mL, mR, mS, mC} from "./MapQueries.ts"
import {includeEntries, getNonDefaultEntries} from "../utils/Utils.ts"

export const mapPrune = (m: M) => {
  return ([
    ...mG(m).map(gi => ({...includeEntries(gi, [...Object.keys(gSaveAlways), ...getNonDefaultEntries(includeEntries(gi, Object.keys(gSaveOptional)), gSaveOptional)])})),
    ...mL(m).map(li => ({...includeEntries(li, [...Object.keys(lSaveAlways), ...getNonDefaultEntries(includeEntries(li, Object.keys(lSaveOptional)), lSaveOptional)])})),
    ...mR(m).map(ri => ({...includeEntries(ri, [...Object.keys(rSaveAlways), ...getNonDefaultEntries(includeEntries(ri, Object.keys(rSaveOptional)), rSaveOptional)])})),
    ...mS(m).map(si => ({...includeEntries(si, [...Object.keys(sSaveAlways), ...getNonDefaultEntries(includeEntries(si, Object.keys(sSaveOptional)), sSaveOptional)])})),
    ...mC(m).map(ci => ({...includeEntries(ci, [...Object.keys(cSaveAlways), ...getNonDefaultEntries(includeEntries(ci, Object.keys(cSaveOptional)), cSaveOptional)])}))
  ] as M).sort(sortNode)
}
