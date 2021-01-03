import {mapMem} from "./Map";

export const mapTemplate = {
    start: () => {
        let cm = mapMem.getData().r;
        mapTemplate.iterate(cm);
    },

    iterate: (cm) => {
        cm.d.map(i => mapTemplate.iterate(i));
        cm.s.map(i => mapTemplate.iterate(i));
        cm.c.map(i => i.map(j => mapTemplate.iterate(j)));
    }
};
