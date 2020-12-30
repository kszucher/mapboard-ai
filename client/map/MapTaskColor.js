import {mapMem} from "./Map";
import {getBgc} from "../core/Utils";

export const mapTaskColor = {
    start: () => {
        let cm = mapMem.getData().r;
        mapTaskColor.iterate(cm);
    },

    iterate: (cm) => {
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

        let dCount = Object.keys(cm.d).length;
        for (let i = 0; i < dCount; i++) {
            mapTaskColor.iterate(cm.d[i]);
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapTaskColor.iterate(cm.s[i]);
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapTaskColor.iterate(cm.c[i][j]);
            }
        }
    }
};
