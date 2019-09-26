import {mapMem}                                             from "./Map";
import {getBgc} from "./Utils";

class MapColor {
    start () {
        let cm =                                            mapMem.data.s[0];
        this.iterate(cm);
    }

    iterate(cm) {
        if (cm.taskStatus !== -1) {

            cm.sTextColor = '#000000';

            switch (cm.taskStatus) {
                case 0: cm.lineColor =                      '#bbbbbb';  break;
                case 1: cm.lineColor =                      '#2c9dfc';  break;
                case 2: cm.lineColor =                      '#d5802a';  break;
                case 3: cm.lineColor =                      '#25bf25';  break;
            }


            if (cm.taskStatus === 0) {
                cm.ellipseFill = 0;
            }
            else {
                cm.ellipseFill = 1;
                cm.ellipseBorderColor = getBgc();

                switch (cm.taskStatus) {
                    case 0: cm.ellipseFill = 0;                         break;
                    case 1: cm.ellipseFillColor =           '#d4ebfe';  break;
                    case 2: cm.ellipseFillColor =           '#f6e5d4';  break;
                    case 3: cm.ellipseFillColor =           '#d4f6d4';  break;
                }
            }
        }
        else {
            cm.ellipseFill = 0;
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            this.iterate(cm.s[i]);
        }
    }
}

export let mapTaskColor = new MapColor();
