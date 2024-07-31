import {mC, mS} from "../mapQueries/MapQueries.ts"
import {isCEODO, isSEODO} from "../mapQueries/PathQueries.ts"
import {M, PS} from "../state/MapStateTypes.ts"

export const offsetSC = (m: M, ip: PS, offset: number) => {
  mS(m).forEach(si => isSEODO(ip, si.path) && (si.path[ip.length - 1] += offset))
  mC(m).forEach(ci => isCEODO(ip, ci.path) && (ci.path[ip.length - 1] += offset))
}
