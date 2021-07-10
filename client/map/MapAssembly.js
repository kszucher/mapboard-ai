import {copy, subsasgn} from "../core/Utils";

export function mapAssembly(dataLinear) {
    let dataNested = {};
    for (let i = 0; i < dataLinear.length; i++) {
        subsasgn(dataNested, copy(dataLinear[i].path), copy(dataLinear[i]));
        if (i === 0) {
            dataNested.r.d = [{},{}];

            // MOVE THIS TO MAPINIT USING MAPPROPS and FORGET ABOUT MONGO AS IT WILL WORK AS IS
            dataNested.m = {
                alignment: 'adaptive',
                density: 'large',

                taskConfigN: 4,
                taskConfigGap: 4,
                margin: 32,
            }
        }
    }
    return dataNested;
}
