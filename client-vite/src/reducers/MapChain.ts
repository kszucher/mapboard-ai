import {M, R, S, C} from "../state/MapStateTypes.ts"
import {isR, isS, isC, isSS, isCS, getHP} from "../queries/MapQueries.ts"

export const mapChain = (m: M) => {
  const hp = getHP(m)
  m.forEach(ni => {
    switch (true) {
      case isR(ni.path): {
        break
      }
      case isS(ni.path): {
        const si = ni as S
        si.si1 = hp.get(si.path.slice(0, -2).join(''))!.nodeId
        hp.get(si.path.slice(0, -2).join(''))!.so1.push(si.nodeId)
        if (isSS(si.path)) {
          hp.get(si.path.slice(0, -4).join(''))!.so2.push(si.nodeId)
        } else if (isCS(si.path)) {
          hp.get(si.path.slice(0, -5).join(''))!.so2.push(si.nodeId)
        }
        for (let i = 0; i < si.path.at(-1); i++) {
          const sui = hp.get([...si.path.slice(0, -1), i].join('')) as S
          si.su.push(sui.nodeId)
        }
        break
      }
      case isC(ni.path): {
        const ci = ni as C
        const si1 = hp.get(ci.path.slice(0, -3).join('')) as S
        const si2 = hp.get(ci.path.slice(0, -5).join('')) as S
        ci.si1 = si1.nodeId
        ci.si2 = si2.nodeId
        ;(hp.get(ci.path.slice(0, -3).join('')) as S).co1.push(ci.nodeId)
        ;(hp.get(ci.path.slice(0, -5).join('')) as R | S).co2.push(ci.nodeId)
        for (let i = 0; i < ci.path.at(-2); i++) {
          const cdi = hp.get([...ci.path.slice(0, -2), i, ci.path.at(-1)].join('')) as C
          ci.cu.push(cdi.nodeId)
        }
        for (let i = 0; i < ci.path.at(-1); i++) {
          const cri = hp.get([...ci.path.slice(0, -2), ci.path.at(-2), i].join('')) as C
          ci.cl.push(cri.nodeId)
        }
        break
      }
    }
  })
  m.slice().reverse().forEach(ni => {
    switch (true) {
      case isC(ni.path): {
        const ci = ni as C
        for (let i = 0; i < ci.path.at(-2); i++) {
          const cdi = hp.get([...ci.path.slice(0, -2), i, ci.path.at(-1)].join('')) as C
          cdi.cd.push(ci.nodeId)
        }
        for (let i = 0; i < ci.path.at(-1); i++) {
          const cri = hp.get([...ci.path.slice(0, -2), ci.path.at(-2), i].join('')) as C
          cri.cr.push(ci.nodeId)
        }
        break
      }
    }
  })
  m.forEach(ni => {
    switch (true) {
      case isC(ni.path): {
        const ci = ni as C
        ci.cv = [...ci.cu, ...ci.cd, ci.nodeId]
        ci.ch = [...ci.cl, ...ci.cr, ci.nodeId]
        break
      }
    }
  })
  return m
}
