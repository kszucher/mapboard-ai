export const mapTaskCalc = {
    start: (r) => {
        mapTaskCalc.iterate(r, r.task);
    },

    iterate: (cm, task) => {
        if (cm.task === task) {
            cm.task = task;
        }
        cm.d.map(i => mapTaskCalc.iterate(i, cm.task));

        let sCount = Object.keys(cm.s).length;
        if (sCount === 0) {
            if (cm.taskStatusInherited === 1) {
                cm.taskStatus = 0;
            }
        } else {
            cm.taskStatus = 0;
            let firstTaskStatus = 0;
            let isSameTaskStatus = true;
            for (let i = 0; i < sCount; i++) {
                mapTaskCalc.iterate(cm.s[i], cm.task);
                if (i === 0) {
                    firstTaskStatus = cm.s[0].taskStatus
                } else {
                    let currTaskStatus = cm.s[i].taskStatus;
                    if (currTaskStatus !== firstTaskStatus) {
                        isSameTaskStatus = false;
                    }
                }
            }
            if (isSameTaskStatus) {
                cm.taskStatus = firstTaskStatus;
                cm.taskStatusInherited = 1;
            }
        }

        cm.c.map(i => i.map(j => mapTaskCalc.iterate(j, cm.task)));
    }
};
