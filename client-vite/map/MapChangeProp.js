import {resolveScope} from "../core/DefaultProps"

export const mapChangeProp = {
    start: (cm, assignment, scope, skip) => {
        mapChangeProp.iterate(cm, assignment, scope, skip)
    },

    iterate: (cm, assignment, scope, skip) => {
        if (skip === true) {
            skip = false
        } else {
            if (scope === '' || resolveScope(cm)[scope]) {
                Object.assign(cm, typeof assignment === 'function' ? assignment() : assignment)
            }
        }
        cm.d.map(i => mapChangeProp.iterate(i, assignment, scope, skip))
        cm.s.map(i => mapChangeProp.iterate(i, assignment, scope, skip))
        cm.c.map(i => i.map(j => mapChangeProp.iterate(j, assignment, scope, skip)))
    }
}
