import '../css/Layout.css'
import React, {useContext, useEffect} from 'react'
import SignIn from "./SignIn";
import {Workspace} from "./Workspace";
import {Context, remoteGetState} from "../core/Store";
import {windowHandler} from "../core/WindowHandler";
import {checkPop, getDefaultMap, initDomData, loadMap, push, recalc, redraw} from "../map/Map";
import {eventRouter, lastEvent} from "../core/EventRouter";
import {eventEmitter} from "../core/EventEmitter";

export function Communication() {

    const [state, dispatch] = useContext(Context);

    // BÁRMI AMI ITT VAN, biztosan nem ide való, hanem egy COMMUNCIcATION komponensbe
    const {isLoggedIn, serverAction, serverResponse, mapId, mapStorageOut, mapNameToSave} = state;

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

    useEffect(() => { // igazából ez nem is itt lesz de tényleg... a WORKSPACE-re kell rátenni, mert oda való
        isLoggedIn ? windowHandler.addListeners() : windowHandler.removeListeners();
    }, [isLoggedIn]);

    useEffect(() => {
        // console.log('SERVER_ACTION: ' + serverAction);
        let msg = {};
        if (serverAction === 'ping') {
            msg = {cmd: 'pingRequest'};
        } else {
            const cred = JSON.parse(localStorage.getItem('cred'));
            if (cred && cred.email && cred.password) {
                switch (serverAction) {
                    case 'signIn':          msg = {cmd: 'signInRequest', cred}; break;
                    case 'openMap':         msg = {cmd: 'openMapRequest', cred, mapName: mapId}; break;
                    case 'createMapInMap':  msg = {cmd: 'createMapInMapRequest', cred, newMap: getDefaultMap(mapNameToSave)}; break;
                    case 'createMapInTab':  msg = {cmd: 'createMapInTabRequest', cred, newMap: getDefaultMap(mapNameToSave)}; break;
                    case 'saveMap':         msg = {cmd: 'saveMapRequest', cred, mapName: mapId, mapStorage: mapStorageOut}; break;
                }
            }
        }
        console.log('SERVER_MESSAGE: ' + JSON.stringify(msg));
        commSend(msg);
    }, [serverAction]);

    useEffect(() => {
        if (serverResponse.cmd) {
            console.log('SERVER_RESPONSE: ' + JSON.stringify(serverResponse.cmd));
            switch (serverResponse.cmd !== 'simulated' && serverResponse.cmd) {
                case 'pingSuccess': {
                    const cred = JSON.parse(localStorage.getItem('cred'));
                    if (cred && cred.email && cred.password) {
                        dispatch({type: 'SIGN_IN', payload: cred})
                    }
                    break;
                }
                case 'signInSuccess': {
                    initDomData();
                    dispatch({type: 'SIGN_IN_SUCCESS', payload: serverResponse.headerData});
                    dispatch({type: 'OPEN_MAP', payload: {source: 'SERVER_SIGN_IN_SUCCESS'}});
                    break;
                }
                case 'signInFail': {
                    console.log('sign in attempt failed');
                    // console.log(localStorage);
                    localStorage.clear();
                    break;
                }
                case 'openMapSuccess': {
                    console.log(serverResponse)

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
        }
    }, [serverResponse]);

    return null;
}
