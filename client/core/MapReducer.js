import {recalc} from "../map/Map";
import {getSelectionContext} from "../node/NodeSelect"

export function mapDispatch(action, payload) {
    console.log('MAPDISPATCH: ' + action);
    mapReducer(action, payload);
    recalc();
}

function mapReducer(action, payload) {
    // let sc = getSelectionContext();
    // let {lm} = sc;
    switch (action) {
        // A -----------------------------------------------------------------------------------------------------------
        // B -----------------------------------------------------------------------------------------------------------
    }
}
