import '../css/Layout.css'
import React, {useContext, useEffect} from 'react'
import SignIn from "./SignIn";
import {Workspace} from "./Workspace";
import {Context, remoteGetState} from "../core/Store";
import {windowHandler} from "../core/WindowHandler";
import {checkPop, getDefaultMap, initDomData, loadMap, push, recalc, redraw} from "../map/Map";
import {eventRouter, lastEvent} from "../core/EventRouter";
import {eventEmitter} from "../core/EventEmitter";

export function Page() {

    const [state, dispatch] = useContext(Context);

    const {isLoggedIn} = state;

    return( // meg majd ugye a loader is, annak függvényében, hogy...
        isLoggedIn
            ? <Workspace/>
            : <SignIn/>
    )
}
