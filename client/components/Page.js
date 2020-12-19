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

    const {isLoggedIn, serverAction, serverResponse, mapId, mapStorage, mapStorageOut, mapNameToSave} = state;

    const post = (message, callback) => {
        let myUrl = process.env.NODE_ENV === 'development' ? "http://127.0.0.1:8082/beta" : "https://mindboard.io/beta";
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
                callback(JSON.parse(xmlHttp.responseText));
        };
        xmlHttp.open("POST", myUrl, true); // true for asynchronous
        xmlHttp.send(JSON.stringify(message));
        // TODO: simplify this to fetch
    };

    // TODO FETCH SERVER COMMUNICATOR IMPLEMENTATION AS WELL
    
    const commSend = (obj) => {
        post(obj, response => dispatch({type: 'SERVER_RESPONSE', payload: response}));
    };
    
    const fetchSend = (obj) => {
        // TODO  
    };

    useEffect(() => {
        let cred = JSON.parse(localStorage.getItem('cred'));
        if (cred && cred.email && cred.password) {
            dispatch({type: 'SIGN_IN', payload: {email: cred.email, password: cred.password}})
        }
    }, []);

    useEffect(() => { // igazából ez nem is itt lesz de tényleg... a WORKSPACE-re kell rátenni, mert oda való
        isLoggedIn ? windowHandler.addListeners() : windowHandler.removeListeners();
    }, [isLoggedIn]);

    useEffect(() => {
        let cred = JSON.parse(localStorage.getItem('cred'));
        if (isLoggedIn && cred && cred.password) {
            switch (serverAction) {
                case 'signIn':          commSend({cmd: 'signInRequest',         cred}); break;
                case 'openMap':         commSend({cmd: 'openMapRequest',        cred, mapName: mapId}); break;
                case 'createMapInMap':  commSend({cmd: 'createMapInMapRequest', cred, newMap: getDefaultMap(mapNameToSave)}); break;
                case 'createMapInTab':  commSend({cmd: 'createMapInTabRequest', cred, newMap: getDefaultMap(mapNameToSave)}); break;
                case 'saveMap':         commSend({cmd: 'saveMapRequest',        cred, mapName: mapId, mapStorage: mapStorageOut}); break;
            }
        }
    }, [serverAction]);

    useEffect(() => {
        console.log('SERVER: ' + serverResponse.cmd);
        switch (serverResponse.cmd) {
            case 'signInSuccess': {
                initDomData();
                const {headerMapIdList, headerMapNameList, headerMapSelected} = serverResponse.headerData;
                dispatch({type: 'SIGN_IN_SUCCESS', payload: {headerMapIdList, headerMapNameList, headerMapSelected}});
                dispatch({type: 'OPEN_MAP', payload: {
                    mapId: headerMapIdList[headerMapSelected],
                    mapName: headerMapNameList[headerMapSelected],
                    pushHistory: true,
                    breadcrumbsOp: 'resetPush'}});
                break;
            }
            case 'signInFail': {
                console.log('sign in attempt failed');
                // console.log(localStorage);
                // localStorage.clear();
                break;
            }
            case 'openMapSuccess': {
                // ITT TELJESN NORMÁLIS A NODEREDUCER-nek küldött NODEDISPATCH
                loadMap(serverResponse.mapStorage);
                recalc();
                redraw();
                
                
                
                break;
            }
            case 'createMapInMapSuccess': {
                eventEmitter('insertIlinkFromMongo');
                recalc();
                eventEmitter('save');
                recalc();
                redraw();
                break;
            }
            case 'createMapInTabSuccess': {
                break;
            }
            case 'saveMapRequestSuccess': {
                eventRouter.processEvent({
                    type: 'serverEvent',

                })
                console.log('save success');
                break;
            }
            case 'imageSaveSuccess': {
                // FELTÉVE, hogy továbbfejlesztettük az alaprendszert is fetch-essé...
                // VAGY pedig külön kell szedni

                //         push();
                //         eventEmitter('newChild');
                //         recalc();
                //         eventEmitter('insertImageFromLinkAsNode');
                //         recalc();
                //         redraw();
                //         checkPop();
            }
        }
    }, [serverResponse]);

    return( // meg majd ugye a loader is, annak függvényében, hogy...
        isLoggedIn
            ? <Workspace/>
            : <SignIn/>
    )
}
