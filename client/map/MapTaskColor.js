export const mapTaskColor = {
    start: (m, cr) => {
        mapTaskColor.iterate(m, cr)
    },

    iterate: (m, cm) => {
        if (cm.task) {
            if (cm.taskStatus !== -1) {
                cm.sTextColor = '#222222'
                switch (cm.taskStatus) {
                    case 0: cm.lineColor = '#bbbbbb';  break
                    case 1: cm.lineColor = '#2c9dfc';  break
                    case 2: cm.lineColor = '#d5802a';  break
                    case 3: cm.lineColor = '#25bf25';  break
                }
                if (cm.taskStatus === 0) {
                    cm.sFillColor = ''
                } else {
                    switch (cm.taskStatus) {
                        case 0: cm.sFillColor = ''       ;  break
                        case 1: cm.sFillColor = '#d4ebfe';  break
                        case 2: cm.sFillColor = '#f6e5d4';  break
                        case 3: cm.sFillColor = '#d4f6d4';  break
                    }
                }
            }
        }
        cm.d.map(i => mapTaskColor.iterate(m, i))
        cm.s.map(i => mapTaskColor.iterate(m, i))
        cm.c.map(i => i.map(j => mapTaskColor.iterate(m, j)))
    }
}
