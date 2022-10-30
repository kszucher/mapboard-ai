import {copy} from "../core/Utils"

let currX, currY = 0
let lastOverPath = []

export const mapFindOverPoint = {
    start: (cr, x, y) => {
        currX = x
        currY = y
        lastOverPath = []
        mapFindOverPoint.iterate(cr)
        if (lastOverPath.length === 4) {
            lastOverPath = ['r', 0]
        }
        return lastOverPath
    },

    iterate: (cm) => {
        if (cm.nodeStartX < currX &&
            currX < cm.nodeEndX &&
            cm.nodeY - cm.selfH / 2 < currY &&
            currY < cm.nodeY + cm.selfH  / 2 ) {
            if (cm.index.length !== 2) {
                lastOverPath = copy(cm.path)
            }
        }
        cm.d.map(i => mapFindOverPoint.iterate(i))
        cm.s.map(i => mapFindOverPoint.iterate(i))
        cm.c.map(i => i.map(j => mapFindOverPoint.iterate(j)))
    }
}
