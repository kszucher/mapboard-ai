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

                taskConfigN: 4,
                taskConfigGap: 4,
                margin: 32,
            }
        }
    }
    return dataNested;
}

// todo: kialakítani a prop system-et map esetre is, aminek hála nem kell a mongohoz nyúlni, sőt az új mongoval is lehet régi feature-öket tesztelni
