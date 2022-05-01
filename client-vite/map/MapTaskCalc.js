export const mapTaskCalc = {
    start: (m, cr) => {
        mapTaskCalc.iterate(m, cr)
    },

    iterate: (m, cm) => {
        let dCount = Object.keys(cm.d).length
        if (dCount) {
            cm.taskStatus = -1
            for (let i = 0; i < dCount; i++) {
                mapTaskCalc.iterate(m, cm.d[i])
                if (cm.d[i].taskStatus !== -1) {
                    cm.taskStatus = cm.d[i].taskStatus
                }
            }
        }
        let sCount = Object.keys(cm.s).length
        if (sCount) {
            cm.taskStatus = -1
            let minTaskStatus = 3
            for (let i = 0; i < sCount; i++) {
                mapTaskCalc.iterate(m, cm.s[i])
                let currTaskStatus = cm.s[i].taskStatus
                if (currTaskStatus < minTaskStatus) {
                    minTaskStatus = currTaskStatus
                }
            }
            cm.taskStatus = minTaskStatus
        }
        cm.c.map(i => i.map(j => mapTaskCalc.iterate(m, j)))
    }
}
