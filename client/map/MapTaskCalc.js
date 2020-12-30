import {mapMem} from "./Map";

export const mapTaskCalc = {
    start: () => {
        let cm = mapMem.getData().r;
        mapTaskCalc.iterate(cm);
    },

    iterate: (cm) => {
        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            mapTaskCalc.iterate(cm.d[i]);
        }

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

                mapTaskCalc.iterate(cm.s[i]);

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

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapTaskCalc.iterate(cm.c[i][j]);
            }
        }
    }
};
