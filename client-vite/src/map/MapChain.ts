import {M} from "../state/MTypes"
import {N} from "../state/NPropsTypes"

export const mapChain = {
  start: (m: M) => {
    Object.assign(m.r[0], {
      parentPath: [],
      parentNodeId: '',
      parentParentNodeId: '',
      path: ['r', 0],
      isRoot: 1,
      type: 'struct',
    })
    mapChain.iterate(m, m.r[0])
  },

  iterate: (m: M, n: N) => {
    if (!n.isRoot) {
      if (n.type === 'dir') {
        n.path = [...n.parentPath, "d", n.index]
      } else if (n.type === 'struct') {
        n.path = [...n.parentPath, "s", n.index]
      } else if (n.type === 'cell') {
        n.path = [...n.parentPath, "c", n.index[0], n.index[1]]
      }
    }
    let dCount = Object.keys(n.d).length
    for (let i = 0; i < dCount; i++) {
      Object.assign(n.d[i], {
        parentPath: ['r', 0],
        parentNodeId: n.nodeId,
        parentParentNodeId: n.parentNodeId,
        parentType: n.type,
        isRootChild: 1,
        type: 'dir',
        index: i,
      })
      mapChain.iterate(m, n.d[i])
    }
    let sCount = Object.keys(n.s).length
    for (let i = 0; i < sCount; i++) {
      Object.assign(n.s[i], {
        parentPath: n.path.slice(0),
        parentNodeId: n.nodeId,
        parentParentNodeId: n.parentNodeId,
        parentType: n.type,
        parentParentType: n.parentType,
        type: 'struct',
        index: i,
      })
      mapChain.iterate(m, n.s[i])
    }
    let rowCount = Object.keys(n.c).length
    let colCount = Object.keys(n.c[0]).length
    for (let i = 0; i < rowCount; i++) {
      for (let j = 0; j < colCount; j++) {
        Object.assign(n.c[i][j], {
          parentPath: n.path.slice(0),
          parentNodeId: n.nodeId,
          parentParentNodeId: n.parentNodeId,
          parentType: n.type,
          parentParentType: n.parentType,
          type: 'cell',
          index: [i, j],
        })
        mapChain.iterate(m, n.c[i][j])
      }
    }
    n.hasDir = dCount > 0 ? 1 : 0
    n.hasStruct = sCount > 0? 1 : 0
    n.hasCell = (rowCount === 1 && colCount === 0) ? 0 : 1
  }
}
