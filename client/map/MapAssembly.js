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

// TODO:
//  mongoban
//      a 4 unused cuccot kiirtjuk,
//      utána a 2 fontosat bevezetjük,
//      a push/position0-val az m-et bevezetjük
//  a mapDisassembly pedig csak az ELTÉRŐ dolgokat engedi majd ki --> WIN és utána jöhet az, hogy mongo push restore whatever szóval MONGO MONGO MONGO BONG
