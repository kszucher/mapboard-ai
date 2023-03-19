import {M} from "../state/MTypes"
import {N} from "../state/NPropsTypes"

export const mapPrint = {
  str: '',
  entryLength: 0,

  start: (m: M, n: N) => {
    mapPrint.str = ''
    mapPrint.entryLength = n.path.length
    mapPrint.iterate(m, n)
    console.log(mapPrint.str)
  },

  iterate: (m: M, n: N) => {
    let indentationCount = n.path.length - mapPrint.entryLength
    mapPrint.str += ('  '.repeat(indentationCount))
    mapPrint.str += n.content.replace(/<br\s*[\/]?>/gi, '\n' + '  '.repeat(indentationCount))
    mapPrint.str += '\n'

    n.d.map(i => mapPrint.iterate(m, i))
    n.s.map(i => mapPrint.iterate(m, i))
    n.c.map(i => i.map(j => mapPrint.iterate(m, j)))
  }
}
