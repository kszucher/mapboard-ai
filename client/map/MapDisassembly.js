import {copy} from "../core/Utils"

let dcm = []

export const mapDisassembly = {
    start: (cm) => {
        dcm = []
        dcm.push(copy(cm.m))
        // TODO loop
        mapDisassembly.iterate(cm.r[0])
        return dcm
    },

    iterate: (cm) => {
        let nodeCopy = copy(cm)
        delete nodeCopy['d']
        delete nodeCopy['s']
        delete nodeCopy['c']
        dcm.push(nodeCopy)
        cm.d.map(i => mapDisassembly.iterate(i))
        cm.s.map(i => mapDisassembly.iterate(i))
        cm.c.map(i => i.map(j => mapDisassembly.iterate(j)))
    }
}
