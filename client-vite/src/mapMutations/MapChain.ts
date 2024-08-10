import {M, R, S, C} from "../state/MapStateTypes.ts"
import {getHP} from "../mapQueries/MapQueries.ts"
import {isC, isCS, isRS, isRSC, isS, isSS, isSSC} from "../mapQueries/PathQueries.ts"

export const mapChain = (m: M) => {
  const hp = getHP(m)
  m.forEach(ni => {
    switch (true) {
      case isS(ni.path): {
        const si = ni as S
        if (isRS(si.path)) {
          si.ri1 = hp.get(si.path.slice(0, -2).join('')) as R
          si.ri1.so1.push(si)
        } else if (isSS(si.path)) {
          si.si1 = hp.get(si.path.slice(0, -2).join('')) as S
          si.si1.so1.push(si)
        } else if (isCS(si.path)) {
          si.ci1 = hp.get(si.path.slice(0, -2).join('')) as C
          si.ci1.so1.push(si)
        }
        for (let i = 0; i < si.path.at(-1); i++) {
          const sui = hp.get([...si.path.slice(0, -1), i].join('')) as S
          si.su.push(sui)
        }
        break
      }
      case isC(ni.path): {
        const ci = ni as C
        ci.si1 = hp.get(ci.path.slice(0, -3).join('')) as S
        ci.si1.co1.push(ci)
        ci.cv.push(ci)
        ci.ch.push(ci)
        for (let i = 0; i < ci.path.at(-2); i++) {
          const cdi = hp.get([...ci.path.slice(0, -2), i, ci.path.at(-1)].join('')) as C
          ci.cu.push(cdi)
          ci.cv.push(cdi)
        }
        for (let i = 0; i < ci.path.at(-1); i++) {
          const cri = hp.get([...ci.path.slice(0, -2), ci.path.at(-2), i].join('')) as C
          ci.cl.push(cri)
          ci.ch.push(cri)
        }
        if (isRSC(ni.path)) {
          ci.ri2 = hp.get(ci.path.slice(0, -5).join('')) as R
        } else if (isSSC(ni.path)) {
          ci.si2 = hp.get(ci.path.slice(0, -5).join('')) as S
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
          rix.so.push(si)
        }
        for (let i = 0; i < siListS.length; i++) {
          const six = hp.get(siListS[i].join('')) as S
          six.so.push(si)
        }
        for (let i = 0; i < siListC.length; i++) {
          const cix = hp.get(siListC[i].join('')) as C
          cix.so.push(si)
        }
        for (let i = 0; i < si.path.at(-1); i++) {
          const sdi = hp.get([...si.path.slice(0, -1), i].join('')) as S
          sdi.sd.push(si)
        }
        break
      }
      case isC(ni.path): {
        const ci = ni as C
        const niList = ci.path.map((_, i) => ci.path.slice(0, i))
        const siListR = niList.filter(pi => pi.at(-2) === 'r')
        const siListS = niList.filter(pi => pi.at(-2) === 's')
        for (let i = 0; i < siListR.length; i++) {
          const rix = hp.get(siListR[i].join('')) as R
          rix.co.push(ci)
        }
        for (let i = 0; i < siListS.length; i++) {
          const six = hp.get(siListS[i].join('')) as S
          six.co.push(ci)
        }
        for (let i = 0; i < ci.path.at(-2); i++) {
          const cdi = hp.get([...ci.path.slice(0, -2), i, ci.path.at(-1)].join('')) as C
          cdi.cd.push(ci)
          cdi.cv.push(ci)
        }
        for (let i = 0; i < ci.path.at(-1); i++) {
          const cri = hp.get([...ci.path.slice(0, -2), ci.path.at(-2), i].join('')) as C
          cri.cr.push(ci)
          cri.ch.push(ci)
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
}
