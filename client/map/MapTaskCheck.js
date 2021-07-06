import {mapState} from "../core/MapFlow";

export const mapTaskCheck = {
    start: (m, r) => {
        mapState.taskLeft = 0;
        mapState.taskRight = 0;
        mapTaskCheck.iterate(m, r);
    },

    iterate: (m, cm) => {
        if (cm.task) {
            try {
                if (cm.path[2] === 0) {
                    mapState.taskRight = 1;
                } else {
                    mapState.taskLeft = 1;
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
