import {mapMem} from "./Map";

class MapUpdate {
    start() {
        let cm = mapMem.data.s[0];
        this.iterate(cm);
    }

    iterate(cm) {


        // 1. csinálok egy elink property-t üresen, elmentem az összes map-et
        // 2. csinálok itt egy szép logikát, ami a megfelelő részt átmásolja, elmentem az összes map-et
        // 3. kitörlöm az eredetit meg a rá való hivatkozásokat
        // 4. WIN


        // let's fuckin' rock with this!!! feel the power of goin' live.



        let rowCount = Object.keys(cm.c).length;
        let colCount = Object.keys(cm.c[0]).length;
        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < colCount; j++) {
                this.iterate(cm.c[i][j]);
            }
        }

        let sCount = Object.keys(cm.s).length;
        for (let i = 0; i < sCount; i++) {
            this.iterate(cm.s[i]);
        }
    }
}

export let mapUpdate = new MapUpdate();
