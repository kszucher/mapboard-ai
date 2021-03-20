import {mapState} from "../core/MapReducer";

export const mapTaskCheck = {
    start: (r) => {
        mapState.taskLeft = 0;
        mapState.taskRight = 0;
        mapTaskCheck.iterate(r);
    },

    iterate: (cm) => {
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

        if (cm.d) cm.d.map(i => mapTaskCheck.iterate(i));
        if (cm.s) cm.s.map(i => mapTaskCheck.iterate(i));
        if (cm.c) cm.c.map(i => i.map(j => mapTaskCheck.iterate(j)));
    }
};
