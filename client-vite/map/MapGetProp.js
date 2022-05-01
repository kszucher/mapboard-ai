export const mapGetProp = {
    start: (m, cm, prop) => {
        let firstProp = {[prop]: undefined}
        if (Object.keys(cm.d).length) {
            firstProp = {[prop]: cm.d[0][prop]}
        } else if (Object.keys(cm.s).length) {
            firstProp = {[prop]: cm.s[0][prop]}
        }
        mapGetProp.iterate(m, cm, prop, firstProp)
        return firstProp[prop]
    },

    iterate: (m, cm, prop, firstProp) => {
        let dCount = Object.keys(cm.d).length
        if (dCount) {
            for (let i = 0; i < dCount; i++) {
                mapGetProp.iterate(m, cm.d[i])
                if (cm.d[i][prop] !== firstProp[prop]) {
                    firstProp[prop] = undefined
                }
            }
        }
        let sCount = Object.keys(cm.s).length
        if (sCount) {
            for (let i = 0; i < sCount; i++) {
                mapGetProp.iterate(m, cm.s[i])
                if (cm.s[i][prop] !== firstProp[prop]) {
                    firstProp[prop] = undefined
                }
            }
        }
        cm.c.map(i => i.map(j => mapGetProp.iterate(m, j, prop, firstProp)))
    }
}
