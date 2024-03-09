import {M, R, S, C} from "../state/MapStateTypes.ts"
import {isS, isC, isSS, isCS, getHP, isRS} from "../queries/MapQueries.ts"

export const mapChain = (m: M) => {
  const hp = getHP(m)
  m.forEach(ni => {
    switch (true) {
      case isS(ni.path): {
        const si = ni as S
        if (isRS(si.path)) {
          const ri1 = hp.get(si.path.slice(0, -2).join('')) as R
          si.ri1 = ri1.nodeId
          ri1.so1.push(si.nodeId)
        } else if (isSS(si.path)) {
          const si1 = hp.get(si.path.slice(0, -2).join('')) as S
          si.si1 = si1.nodeId
          si1.so1.push(si.nodeId)
        } else if (isCS(si.path)) {
          const ci1 = hp.get(si.path.slice(0, -2).join('')) as S
          si.ci1 = ci1.nodeId
          ci1.so1.push(si.nodeId)
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
        const si2 = hp.get(ci.path.slice(0, -5).join('')) as R | S
        ci.si1 = si1.nodeId
        ci.si2 = si2.nodeId
        si1.co1.push(ci.nodeId)
        ci.cv.push(ci.nodeId)
        ci.ch.push(ci.nodeId)
        for (let i = 0; i < ci.path.at(-2); i++) {
          const cdi = hp.get([...ci.path.slice(0, -2), i, ci.path.at(-1)].join('')) as C
          ci.cu.push(cdi.nodeId)
          ci.cv.push(cdi.nodeId)
        }
        for (let i = 0; i < ci.path.at(-1); i++) {
          const cri = hp.get([...ci.path.slice(0, -2), ci.path.at(-2), i].join('')) as C
          ci.cl.push(cri.nodeId)
          ci.ch.push(cri.nodeId)
        }
        break
      }
    }
  })
  m.slice().reverse().forEach(ni => {
    switch (true) {
      case isS(ni.path): {
        const si = ni as S
        const tiList = si.path.map((_, i) => si.path.slice(0, i))
        const siListR = tiList.filter(pi => pi.at(-2) === 'r')
        const siListS = tiList.filter(pi => pi.at(-2) === 's')
        const siListC = tiList.filter(pi => pi.at(-3) === 'c')
        for (let i = 0; i < siListR.length; i++) {
          const rix = hp.get(siListR[i].join('')) as R
          rix.so.push(si.nodeId)
        }
        for (let i = 0; i < siListS.length; i++) {
          const six = hp.get(siListS[i].join('')) as S
          six.so.push(si.nodeId)
        }
        for (let i = 0; i < siListC.length; i++) {
          const cix = hp.get(siListC[i].join('')) as C
          cix.so.push(si.nodeId)
        }
        for (let i = 0; i < si.path.at(-1); i++) {
          const sdi = hp.get([...si.path.slice(0, -1), i].join('')) as S
          sdi.sd.push(si.nodeId)
        }
        break
      }
      case isC(ni.path): {
        const ci = ni as C
        const tiList = ci.path.map((_, i) => ci.path.slice(0, i))
        const siListR = tiList.filter(pi => pi.at(-2) === 'r')
        const siListS = tiList.filter(pi => pi.at(-2) === 's')
        for (let i = 0; i < siListR.length; i++) {
          const rix = hp.get(siListR[i].join('')) as R
          rix.co.push(ci.nodeId)
        }
        for (let i = 0; i < siListS.length; i++) {
          const six = hp.get(siListS[i].join('')) as S
          six.co.push(ci.nodeId)
        }
        for (let i = 0; i < ci.path.at(-2); i++) {
          const cdi = hp.get([...ci.path.slice(0, -2), i, ci.path.at(-1)].join('')) as C
          cdi.cd.push(ci.nodeId)
          cdi.cv.push(ci.nodeId)
        }
        for (let i = 0; i < ci.path.at(-1); i++) {
          const cri = hp.get([...ci.path.slice(0, -2), ci.path.at(-2), i].join('')) as C
          cri.cr.push(ci.nodeId)
          cri.ch.push(ci.nodeId)
        }
        if (ci.path.at(-1) === 0) {
          const si1 = hp.get(ci.path.slice(0, -3).join('')) as S
          si1.rowCount++
        }
        if (ci.path.at(-2) === 0) {
          const si1 = hp.get(ci.path.slice(0, -3).join('')) as S
          si1.colCount++
        }
        break
      }
    }
  })
  return m
}
