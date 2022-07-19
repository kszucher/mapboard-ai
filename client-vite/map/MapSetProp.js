import {resolveScope} from "../core/DefaultProps"
import { mapref } from '../core/MapStackFlow'

export const mapSetProp = {
    start: (cm, assignment, scope) => {
        if (cm.path.length === 4) {
            Object.assign(mapref(['r', 0]), typeof assignment === 'function' ? assignment() : assignment)
        }
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
