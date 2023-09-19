import {isCED, isCER, isSEODO} from "../selectors/MapSelectorUtils"
import {M, P} from "../state/MapStateTypes"

export const makeSpaceFromS = (m: M, ip: P, length: number) => m.forEach(n => isSEODO(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + length))
export const makeSpaceFromCr = (m: M, ipList: P[], length: number) => m.forEach(n => ipList.map(ip => isCED(ip, n.path) && n.path.splice(ip.length - 2, 1, n.path.at(ip.length - 2) as number + length)))
export const makeSpaceFromCc = (m: M, ipList: P[], length: number) => m.forEach(n => ipList.map(ip => isCER(ip, n.path) && n.path.splice(ip.length - 1, 1, n.path.at(ip.length - 1) as number + length)))
