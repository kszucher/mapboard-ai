import {M, R, S, C} from "../state/MapStateTypes.ts"
import {getHP} from "../mapQueries/MapQueries.ts"
import {isC, isCS, isRS, isS, isSS} from "../mapQueries/PathQueries.ts"

export const mapChain = (m: M) => {
  const hp = getHP(m)
  m.forEach(ni => {
    switch (true) {
      case isS(ni.path): {
        const si = ni as S
        if (isRS(si.path)) {
          si.ri1 = hp.get(si.path.slice(0, -2).join('')) as R
          si.ti1 = si.ri1
          si.ri1.so1.push(si)
        } else if (isSS(si.path)) {
          si.si1 = hp.get(si.path.slice(0, -2).join('')) as S
          si.ti1 = si.si1
          si.si1.so1.push(si)
        } else if (isCS(si.path)) {
          si.ci1 = hp.get(si.path.slice(0, -2).join('')) as C
          si.ti1 = si.ci1
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
        break
      }
    }
  })
  m.slice().reverse().forEach(ni => {
    switch (true) {
      case isS(ni.path): {
        const si = ni as S
        const tiList = si.path.map((_, i) => si.path.slice(0, i))
        const siR = tiList.find(pi => pi.at(-2) === 'r')!
        const siS = tiList.filter(pi => pi.at(-2) === 's')
        const siC = tiList.find(pi => pi.at(-3) === 'c')
        const ri = hp.get(siR.join('')) as R
        ri.so.push(si)
        si.ri = ri
        for (let i = 0; i < siS.length; i++) {
          const six = hp.get(siS[i].join('')) as S
          six.so.push(si)
        }
        if (siC) {
          const ci = hp.get(siC.join('')) as C
          si.ci = ci
          ci.so.push(si)
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
        const siR = niList.filter(pi => pi.at(-2) === 'r')
        const siS = niList.filter(pi => pi.at(-2) === 's')
        for (let i = 0; i < siR.length; i++) {
          const rix = hp.get(siR[i].join('')) as R
          rix.co.push(ci)
        }
        for (let i = 0; i < siS.length; i++) {
          const six = hp.get(siS[i].join('')) as S
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
        break
      }
    }
  })
}
