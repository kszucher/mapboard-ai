import {nodeProps} from "../core/DataProps"
import {copy, shallowCopy} from "../core/Utils"

export const mapInit = {
    start: (m, r) => {
        let {density, taskConfigN, taskConfigGap} = m;

        m.mapWidth = 0;
        m.mapHeight = 0;
        m.sLineDeltaXDefault = density === 'large' ? 30 : 20;
        m.padding = density === 'large' ? 8 : 3;
        m.defaultH = density === 'large' ? 30 : 20; // 30 = 14 + 2*8, 20 = 14 + 2*3
        m.taskConfigD = density === 'large' ? 24 : 20;
        m.taskConfigWidth = taskConfigN * m.taskConfigD + (taskConfigN - 1) * taskConfigGap;

        mapInit.iterate(m, r);
    },

    iterate: (m, cm) => {
        for (const prop in nodeProps.saveAlways) {
            if (!cm.hasOwnProperty(prop)) {
                cm[prop] = copy(nodeProps.saveAlways[prop]);
            }
        }

        for (const prop in nodeProps.saveOptional) {
            if (!cm.hasOwnProperty(prop)) {
                cm[prop] = shallowCopy(nodeProps.saveOptional[prop])
            }
        }

        for (const prop in nodeProps.saveNever.initOnce) {
            if (!cm.hasOwnProperty(prop)) {
                cm[prop] = shallowCopy(nodeProps.saveNever.initOnce[prop])
            }
        }

        for (const prop in nodeProps.saveNever.initAlways) {
            cm[prop] = shallowCopy(nodeProps.saveNever.initAlways[prop])
        }

        cm.d.map(i => mapInit.iterate(m, i));
        cm.s.map(i => mapInit.iterate(m, i));
        cm.c.map(i => i.map(j => mapInit.iterate(m, j)));
    }
};
