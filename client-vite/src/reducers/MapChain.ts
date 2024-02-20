import {M, T} from "../state/MapStateTypes.ts"
import {mT, isR, isS, isC, isSS, isCS, getHP} from "../queries/MapQueries.ts"

export const mapChain = (m: M) => {
  const hp = getHP(m)
  mT(m).forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        break
      }
      case isS(ti.path): {
        ti.si1 = hp.get(ti.path.slice(0, -2).join(''))!.nodeId
        hp.get(ti.path.slice(0, -2).join(''))!.so1.push(ti.nodeId)
        if (isSS(ti.path)) {
          hp.get(ti.path.slice(0, -4).join(''))!.so2.push(ti.nodeId)
        } else if (isCS(ti.path)) {
          hp.get(ti.path.slice(0, -5).join(''))!.so2.push(ti.nodeId)
        }
        for (let i = 0; i < ti.path.at(-1); i++) {
          const sui = hp.get([...ti.path.slice(0, -1), i].join('')) as T
          ti.su.push(sui.nodeId)
        }
        break
      }
      case isC(ti.path): {
        const si1 = hp.get(ti.path.slice(0, -3).join('')) as T
        const si2 = hp.get(ti.path.slice(0, -5).join('')) as T
        ti.si1 = si1.nodeId
        ti.si2 = si2.nodeId
        hp.get(ti.path.slice(0, -3).join(''))!.co1.push(ti.nodeId)
        hp.get(ti.path.slice(0, -5).join(''))!.co2.push(ti.nodeId)
        for (let i = 0; i < ti.path.at(-2); i++) {
          const cdi = hp.get([...ti.path.slice(0, -2), i, ti.path.at(-1)].join('')) as T
          ti.cu.push(cdi.nodeId)
        }
        for (let i = 0; i < ti.path.at(-1); i++) {
          const cri = hp.get([...ti.path.slice(0, -2), ti.path.at(-2), i].join('')) as T
          ti.cl.push(cri.nodeId)
        }
        break
      }
    }
  })
  mT(m).slice().reverse().forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        break
      }
      case isS(ti.path): {
        break
      }
      case isC(ti.path): {
        for (let i = 0; i < ti.path.at(-2); i++) {
          const cdi = hp.get([...ti.path.slice(0, -2), i, ti.path.at(-1)].join('')) as T
          cdi.cd.push(ti.nodeId)
        }
        for (let i = 0; i < ti.path.at(-1); i++) {
          const cri = hp.get([...ti.path.slice(0, -2), ti.path.at(-2), i].join('')) as T
          cri.cr.push(ti.nodeId)
        }
        break
      }
    }
  })
  mT(m).forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        break
      }
      case isS(ti.path): {
        break
      }
      case isC(ti.path): {
          ti.cv = [...ti.cu, ...ti.cd, ti.nodeId]
          ti.ch = [...ti.cl, ...ti.cr, ti.nodeId]
        break
      }
    }
  })
  return m
}
