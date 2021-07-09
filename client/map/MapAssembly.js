import {copy, subsasgn} from "../core/Utils";

export function mapAssembly(dataLinear) {
    let dataNested = {};
    for (let i = 0; i < dataLinear.length; i++) {
        subsasgn(dataNested, copy(dataLinear[i].path), copy(dataLinear[i]));
        if (i === 0) {
            dataNested.r.d = [{},{}];
            // STORE IN MONGO ONCE WORKING

            dataNested.m = {
                alignment: 'adaptive',
                density: 'large',

                sLineDeltaXDefault: 0,
                padding: 0,
                defaultH: 0,

                taskConfigN: 4,
                taskConfigGap: 4,
                margin: 32,
            }
        }
    }
    return dataNested;
}
