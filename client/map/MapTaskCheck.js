export const mapTaskCheck = {
    start: (m, r) => {
        m.taskLeft = 0;
        m.taskRight = 0;
        mapTaskCheck.iterate(m, r, r.task);
    },

    iterate: (m, cm, task) => {
        if (cm.task === task) {
            cm.task = task;
        }
        if (cm.task && !cm.path.includes('c') && cm.path.length > 4) {
            try {
                if (cm.path[3] === 0) {
                    m.taskRight = 1;
                } else {
                    m.taskLeft = 1;
                }
            } catch {
                console.log(cm.path)
            }
        }
        if (cm.d) cm.d.map(i => mapTaskCheck.iterate(m, i, cm.task));
        if (cm.s) cm.s.map(i => mapTaskCheck.iterate(m, i, cm.task));
        if (cm.c) cm.c.map(i => i.map(j => mapTaskCheck.iterate(m, j, cm.task)));
    }
};
