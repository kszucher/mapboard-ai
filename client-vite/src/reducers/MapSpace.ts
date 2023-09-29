import {isCED, isCER, isSEODO, mT} from "../selectors/MapSelector"
import {M, PT} from "../state/MapStateTypes"

export const makeSpaceFromS = (m: M, ip: PT, length: number) => mT(m).forEach(ti => isSEODO(ip, ti.path) && ti.path.splice(ip.length - 1, 1, ti.path.at(ip.length - 1) as number + length))
export const makeSpaceFromCr = (m: M, ipList: PT[], length: number) => mT(m).forEach(ti => ipList.map(ip => isCED(ip, ti.path) && ti.path.splice(ip.length - 2, 1, ti.path.at(ip.length - 2) as number + length)))
export const makeSpaceFromCc = (m: M, ipList: PT[], length: number) => mT(m).forEach(ti => ipList.map(ip => isCER(ip, ti.path) && ti.path.splice(ip.length - 1, 1, ti.path.at(ip.length - 1) as number + length)))
