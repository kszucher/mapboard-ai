import {mapMem} from "./Map";
import {props} from "../node/Node"
import {copy, shallowCopy} from "../core/Utils"

export const mapInit = {
    start: () => {
        let cm = mapMem.getData().r;
        mapInit.iterate(cm);
    },

    iterate: (cm) => {
        Object.keys(props.saveOptional).map(currProperty => {
            if (!cm.hasOwnProperty(currProperty)) {
                cm[currProperty] = ['d', 's', 'c', 'path'].includes(currProperty)?
                    copy(props.saveOptional[currProperty]) :
                    shallowCopy(props.saveOptional[currProperty])
            }
        });

        Object.keys(props.saveNever.initOnce).map(currProperty => {
            if (!cm.hasOwnProperty(currProperty)) {
                cm[currProperty] = shallowCopy(props.saveNever.initOnce[currProperty])
            }
        });

        Object.keys(props.saveNever.initAlways).map(currProperty => {
            cm[currProperty] = shallowCopy(props.saveNever.initAlways[currProperty])
        });

        let dirCount = Object.keys(cm.d).length;
        for (let i = 0; i < dirCount; i++) {
            mapInit.iterate(cm.d[i]);
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            mapInit.iterate(cm.s[i]);
        }

        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                mapInit.iterate(cm.c[i][j]);
            }
        }
    }
};
