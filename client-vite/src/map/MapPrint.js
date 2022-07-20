export const mapPrint = {
    start: (m, cr) => {
        mapPrint.str = ''
        mapPrint.entryLength = cr.path.length
        mapPrint.iterate(m, cr)
        console.log(mapPrint.str)
    },

    iterate: (m, cm) => {
        let indentationCount = cm.path.length - mapPrint.entryLength
        mapPrint.str += ('  '.repeat(indentationCount))
        mapPrint.str += cm.content.replace(/<br\s*[\/]?>/gi, '\n' + '  '.repeat(indentationCount))
        mapPrint.str += '\n'

        cm.d.map(i => mapPrint.iterate(m, i))
        cm.s.map(i => mapPrint.iterate(m, i))
        cm.c.map(i => i.map(j => mapPrint.iterate(m, j)))
    }
}
