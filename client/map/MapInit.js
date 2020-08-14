import {mapMem} from "./Map";
import {props} from "../node/Node"

export const mapInit = {
    start: () => {
        let cm = mapMem.getData().s[0];
        mapInit.iterate(cm);
    },

    iterate: (cm) => {
        Object.keys(props.saveOptional).map(currProperty => {
            if (!cm.hasOwnProperty(currProperty)) {
                cm[currProperty] = props.saveOptional[currProperty];
            }
        });

        Object.keys(props.saveNever.initOnce).map(currProperty => {
            if (!cm.hasOwnProperty(currProperty)) {
                cm[currProperty] = props.saveNever.initOnce[currProperty];
            }
        });

        Object.keys(props.saveNever.initAlways).map(currProperty => {
            cm[currProperty] = props.saveNever.initAlways[currProperty];
        });

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapInit.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapInit.iterate(cm.s[i]);
        }
    }
};
