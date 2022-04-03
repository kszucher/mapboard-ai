export const mapTaskCalc = {
    start: (m, cr) => {
        mapTaskCalc.iterate(m, cr)
    },

    iterate: (m, cm) => {
        cm.d.map(i => mapTaskCalc.iterate(m, i))
        let sCount = Object.keys(cm.s).length
        if (sCount) {
            cm.taskStatus = 0
            let firstTaskStatus = 0
            let isSameTaskStatus = true
            for (let i = 0; i < sCount; i++) {
                mapTaskCalc.iterate(m, cm.s[i])
                if (i === 0) {
                    firstTaskStatus = cm.s[0].taskStatus
                } else {
                    let currTaskStatus = cm.s[i].taskStatus
                    if (currTaskStatus !== firstTaskStatus) {
                        isSameTaskStatus = false
                    }
                }
            }
            if (isSameTaskStatus) {
                cm.taskStatus = firstTaskStatus
            }
        }
        cm.c.map(i => i.map(j => mapTaskCalc.iterate(m, j)))
    }
}
