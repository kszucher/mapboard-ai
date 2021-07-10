export const mapTaskCheck = {
    start: (m, r) => {
        m.taskLeft = 0;
        m.taskRight = 0;
        mapTaskCheck.iterate(m, r);
    },

    iterate: (m, cm) => {
        if (cm.task) {
            try {
                if (cm.path[2] === 0) {
                    m.taskRight = 1;
                } else {
                    m.taskLeft = 1;
                }
            } catch {
                console.log(cm.path)
            }
        }

        if (cm.d) cm.d.map(i => mapTaskCheck.iterate(m, i));
        if (cm.s) cm.s.map(i => mapTaskCheck.iterate(m, i));
        if (cm.c) cm.c.map(i => i.map(j => mapTaskCheck.iterate(m, j)));
    }
};
