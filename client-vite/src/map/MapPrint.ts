import {M, N} from "../types/DefaultProps"

export const mapPrint = {
  str: '',
  entryLength: 0,

  start: (m: M, cn: N) => {
    mapPrint.str = ''
    mapPrint.entryLength = cn.path.length
    mapPrint.iterate(m, cn)
    console.log(mapPrint.str)
  },

  iterate: (m: M, cn: N) => {
    let indentationCount = cn.path.length - mapPrint.entryLength
    mapPrint.str += ('  '.repeat(indentationCount))
    mapPrint.str += cn.content.replace(/<br\s*[\/]?>/gi, '\n' + '  '.repeat(indentationCount))
    mapPrint.str += '\n'

    cn.d.map(i => mapPrint.iterate(m, i))
    cn.s.map(i => mapPrint.iterate(m, i))
    cn.c.map(i => i.map(j => mapPrint.iterate(m, j)))
  }
}
