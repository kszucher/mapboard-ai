import {M, N} from "../types/DefaultProps"

export const mapChain = {
  start: (m: M) => {
    Object.assign(m.r[0], {
      parentPath: [],
      path: ['r', 0],
      isRoot: 1,
      type: 'struct',
    })
    mapChain.iterate(m, m.r[0])
  },

  iterate: (m: M, cn: N) => {
    if (!cn.isRoot) {
      if (cn.type === 'dir') {
        cn.path = [...cn.parentPath, "d", cn.index]
      } else if (cn.type === 'struct') {
        cn.path = [...cn.parentPath, "s", cn.index]
      } else if (cn.type === 'cell') {
        cn.path = [...cn.parentPath, "c", cn.index[0], cn.index[1]]
      }
    }
    let dCount = Object.keys(cn.d).length
    for (let i = 0; i < dCount; i++) {
      Object.assign(cn.d[i], {
        parentPath: ['r', 0],
        parentType: cn.type,
        isRootChild: 1,
        type: 'dir',
        index: i,
      })
      mapChain.iterate(m, cn.d[i])
    }
    let sCount = Object.keys(cn.s).length
    for (let i = 0; i < sCount; i++) {
      Object.assign(cn.s[i], {
        parentPath: cn.path.slice(0),
        parentType: cn.type,
        parentParentType: cn.parentType,
        type: 'struct',
        index: i,
      })
      mapChain.iterate(m, cn.s[i])
    }
    let rowCount = Object.keys(cn.c).length
    let colCount = Object.keys(cn.c[0]).length
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        Object.assign(cn.c[i][j], {
          parentPath: cn.path.slice(0),
          parentType: cn.type,
          parentParentType: cn.parentType,
          type: 'cell',
          index: [i, j],
        })
        mapChain.iterate(m, cn.c[i][j])
      }
    }
    cn.hasDir = dCount > 0 ? 1 : 0
    cn.hasStruct = sCount > 0? 1 : 0
    cn.hasCell = (rowCount === 1 && colCount === 0) ? 0 : 1
  }
}
