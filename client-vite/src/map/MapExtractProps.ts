import {M} from "../state/MTypes"
import {N} from "../state/NPropsTypes"

export const mapExtractProps = {
  start: (m: M) => {
    m.g.taskLeft = 0
    m.g.taskRight = 0
    mapExtractProps.iterate(m, m.r[0])
  },

  iterate: (m: M, n: N) => {
    if (n.taskStatus !== 0 && !n.path.includes('c') && n.path.length > 4) {
      try {
        if (n.path[3] === 0) {
          m.g.taskRight = 1
        } else {
          m.g.taskLeft = 1
        }
      } catch {
        console.log(n.path)
      }
    }
    n.d.map(i => mapExtractProps.iterate(m, i))
    n.s.map(i => mapExtractProps.iterate(m, i))
    n.c.map(i => i.map(j => mapExtractProps.iterate(m, j)))
  }
}
