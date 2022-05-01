import {resolveScope} from "../core/DefaultProps"

export const mapSetProp = {
    start: (cm, assignment, scope, skip) => {
        mapSetProp.iterate(cm, assignment, scope, skip)
    },

    iterate: (cm, assignment, scope, skip) => {
        if (skip === true) {
            skip = false
        } else {
            if (scope === '' || resolveScope(cm)[scope]) {
                Object.assign(cm, typeof assignment === 'function' ? assignment() : assignment)
            }
        }
        cm.d.map(i => mapSetProp.iterate(i, assignment, scope, skip))
        cm.s.map(i => mapSetProp.iterate(i, assignment, scope, skip))
        cm.c.map(i => i.map(j => mapSetProp.iterate(j, assignment, scope, skip)))
    }
}
