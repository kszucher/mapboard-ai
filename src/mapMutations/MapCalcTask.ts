import {mS} from "../mapQueries/MapQueries.ts"
import {M} from "../mapState/MapStateTypes.ts"

export const mapCalcTask = (m: M) => {
  mS(m).toReversed().forEach(si => si.taskStatus = si.so1.length ? Math.min(...si.so1.map(el => el.taskStatus)) : si.taskStatus)
}
