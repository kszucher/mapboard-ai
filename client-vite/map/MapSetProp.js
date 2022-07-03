import {resolveScope} from "../core/DefaultProps"

export const mapSetProp = {
    start: (cm, assignment, scope) => {
        mapSetProp.iterate(cm, assignment, scope)
    },

    iterate: (cm, assignment, scope) => {
        if (scope === '' || resolveScope(cm)[scope]) {
            Object.assign(cm, typeof assignment === 'function' ? assignment() : assignment)
        }
        cm.d.map(i => mapSetProp.iterate(i, assignment, scope))
        cm.s.map(i => mapSetProp.iterate(i, assignment, scope))
        cm.c.map(i => i.map(j => mapSetProp.iterate(j, assignment, scope)))
    }
}
