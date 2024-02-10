import {M, T} from "../state/MapStateTypes.ts"
import {mT, isR, isS, isC, isSS, isCS} from "../queries/MapQueries.ts"

export const mapChain = (m: M) => {
  const mHashN = new Map<string, T>(m.map(ti => [ti.nodeId, ti as T]));
  const mHashP = new Map<string, T>(m.map(ti => [ti.path.join(''), ti as T]));
  const pathToIndex = new Map<string, number>(m.map((ti, i) => [ti.path.join(''), i]));

  mT(m).forEach(ti => {
    switch (true) {
      case isR(ti.path): {
        break
      }
      case isS(ti.path): {
        ti.si1 = mHashP.get(ti.path.slice(0, -2).join(''))!.nodeId;
        (m.at(pathToIndex.get(ti.path.slice(0, -2).join('')) as number) as T).so1.push(ti.nodeId);
        if (isSS(ti.path)) {
          (m.at(pathToIndex.get(ti.path.slice(0, -4).join('')) as number) as T).so2.push(ti.nodeId);
        } else if (isCS(ti.path)) {
          (m.at(pathToIndex.get(ti.path.slice(0, -5).join('')) as number) as T).so2.push(ti.nodeId);
        }
        for (let i = 0; i < ti.path.at(-1); i++) {
          ti.tsu.push(mHashP.get([...ti.path.slice(0, -1), i].join(''))!.nodeId)
        }
        break
      }
      case isC(ti.path): {
        ti.si1 = mHashP.get(ti.path.slice(0, -3).join(''))!.nodeId;
        ti.si2 = mHashP.get(ti.path.slice(0, -5).join(''))!.nodeId;
        (m.at(pathToIndex.get(ti.path.slice(0, -3).join('')) as number) as T).co1.push(ti.nodeId);
        (m.at(pathToIndex.get(ti.path.slice(0, -5).join('')) as number) as T).co2.push(ti.nodeId);
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
        const si1 = mHashN.get(ti.si1)!
        const i = ti.path.at(-1)
        ti.isTop = i === 0 && si1.isTop ? 1 : 0
        ti.isBottom = i === si1.so1.length - 1 && si1.isBottom === 1 ? 1 : 0
        break
      }
      case isC(ti.path): {
        break
      }
    }
  })
}
