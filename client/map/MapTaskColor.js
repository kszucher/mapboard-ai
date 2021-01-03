import {mapMem} from "./Map";
import {getBgc} from "../core/Utils";

export const mapTaskColor = {
    start: () => {
        let cm = mapMem.getData().r;
        mapTaskColor.iterate(cm);
    },

    iterate: (cm) => {
        if (cm.task) {
            if (cm.taskStatus !== -1) {
                cm.sTextColor = '#000000';
                switch (cm.taskStatus) {
                    case 0: cm.lineColor = '#bbbbbb';  break;
                    case 1: cm.lineColor = '#2c9dfc';  break;
                    case 2: cm.lineColor = '#d5802a';  break;
                    case 3: cm.lineColor = '#25bf25';  break;
                }
                if (cm.taskStatus === 0) {
                    cm.ellipseFill = 0;
                } else {
                    cm.ellipseFill = 1;
                    cm.ellipseBorderColor = getBgc();

                    switch (cm.taskStatus) {
                        case 0: cm.ellipseFill = 0; break;
                        case 1: cm.ellipseFillColor = '#d4ebfe';  break;
                        case 2: cm.ellipseFillColor = '#f6e5d4';  break;
                        case 3: cm.ellipseFillColor = '#d4f6d4';  break;
                    }
                }
            } else {
                cm.ellipseFill = 0;
            }
        }

        cm.d.map(i => mapTaskColor.iterate(i));
        cm.s.map(i => mapTaskColor.iterate(i));
        cm.c.map(i => i.map(j => mapTaskColor.iterate(j)));
    }
};
