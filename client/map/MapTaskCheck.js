import {mapMem} from "./Map";

export const mapTaskCheck = {
    start: (r) => {
        mapMem.taskLeft = 0;
        mapMem.taskRight = 0;
        mapTaskCheck.iterate(r);
    },

    iterate: (cm) => {
        if (cm.task) {
            try {
                if (cm.path[2] === 0) {
                    mapMem.taskRight = 1;
                } else {
                    mapMem.taskLeft = 1;
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
