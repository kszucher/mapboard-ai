import {copy, subsasgn} from "../src/Utils";

export function mapAssembly(dataLinear) {

    let dataNested = {};
    for (let i = 0; i < dataLinear.length; i++) {
        subsasgn(dataNested, copy(dataLinear[i].path), copy(dataLinear[i]))
    }
    return dataNested;
}
