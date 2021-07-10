import {copy, subsasgn} from "../core/Utils";

export function mapAssembly(dataLinear) {
    let dataNested = {};
    for (let i = 0; i < dataLinear.length; i++) {
        subsasgn(dataNested, copy(dataLinear[i].path), copy(dataLinear[i]));
        if (i === 0) {
            dataNested.r.d = [{},{}]; // MONGO SHOULD _PROBABLY_ HAVE_ THIS FIELD FOR EVERY MAP (BUT FOREVERY EMPTY) !!!
            dataNested.m = {} // MONGO SHOULD HAVE THIS FIELD FOR EVERY MAP!!!
        }
    }
    return dataNested;
}
