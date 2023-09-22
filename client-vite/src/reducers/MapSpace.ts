import {isCED, isCER, isSEODO, mT} from "../selectors/MapSelector"
import {M, P} from "../state/MapStateTypes"

export const makeSpaceFromS = (m: M, ip: P, length: number) => mT(m).forEach(t => isSEODO(ip, t.path) && t.path.splice(ip.length - 1, 1, t.path.at(ip.length - 1) as number + length))
export const makeSpaceFromCr = (m: M, ipList: P[], length: number) => mT(m).forEach(t => ipList.map(ip => isCED(ip, t.path) && t.path.splice(ip.length - 2, 1, t.path.at(ip.length - 2) as number + length)))
export const makeSpaceFromCc = (m: M, ipList: P[], length: number) => mT(m).forEach(t => ipList.map(ip => isCER(ip, t.path) && t.path.splice(ip.length - 1, 1, t.path.at(ip.length - 1) as number + length)))
