import {mapMem} from "./Map";

class MapPrint {
    start(cml) {
        this.str = '';
        this.iterate(cml);
        console.log(this.str)
    }

    iterate(cm) {
        this.str += ('\n' + '\t'.repeat(cm.path.length) + cm.content);

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            this.iterate(cm.s[i]);
        }
    }
}

export let mapPrint = new MapPrint();
