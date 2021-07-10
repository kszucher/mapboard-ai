import {mapProps, nodeProps} from "../core/DefaultProps"
import {copy, shallowCopy} from "../core/Utils"

export const mapInit = {
    start: (m, r) => {
        for (const prop in mapProps.saveOptional) {
            if (!m.hasOwnProperty(prop)) {
                m[prop] = copy(mapProps.saveOptional[prop]);
            }
        }

        for (const prop in mapProps.saveNever) {
            if (!m.hasOwnProperty(prop)) {
                m[prop] = copy(mapProps.saveNever[prop]);
            }
        }

        m.sLineDeltaXDefault = m.density === 'large' ? 30 : 20;
        m.padding = m.density === 'large' ? 8 : 3;
        m.defaultH = m.density === 'large' ? 30 : 20; // 30 = 14 + 2*8, 20 = 14 + 2*3
        m.taskConfigD = m.density === 'large' ? 24 : 20;
        m.taskConfigWidth = m.taskConfigN * m.taskConfigD + (m.taskConfigN - 1) * m.taskConfigGap;

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
