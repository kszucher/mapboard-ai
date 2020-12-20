import '../css/Layout.css'
import React, {useContext, useEffect} from 'react'
import {Context} from "../core/Store";
import {checkPop, getDefaultMap, initDomData, loadMap, recalc, redraw} from "../map/Map";
import {nodeDispatch} from "../core/NodeReducer";

export function Communication() {

    const [state, dispatch] = useContext(Context);

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

    useEffect(() => {
        let lastAction = [...serverAction].pop();
        let msg = {};
        if (lastAction === 'ping') {
            msg = {cmd: 'pingRequest'};
        } else {
            const cred = JSON.parse(localStorage.getItem('cred'));
            if (cred && cred.email && cred.password) {
                switch (lastAction) {
                    case 'signIn':          msg = {cmd: 'signInRequest',            cred};                                              break;
                    case 'openMap':         msg = {cmd: 'openMapRequest',           cred, mapName: mapId};                              break;
                    case 'createMapInMap':  msg = {cmd: 'createMapInMapRequest',    cred, newMap: getDefaultMap(mapNameToSave)};        break;
                    case 'createMapInTab':  msg = {cmd: 'createMapInTabRequest',    cred, newMap: getDefaultMap(mapNameToSave)};        break;
                    case 'saveMap':         msg = {cmd: 'saveMapRequest',           cred, mapName: mapId, mapStorage: mapStorageOut};   break;
                }
            }
        }
        console.log('SERVER_MESSAGE: ' + JSON.stringify(msg));
        commSend(msg);
    }, [serverAction]);

    useEffect(() => {
        if (serverResponse.cmd) {
            console.log('SERVER_RESPONSE: ' + JSON.stringify(serverResponse.cmd));
            switch (serverResponse.cmd) {
                case 'pingSuccess': {
                    const cred = JSON.parse(localStorage.getItem('cred'));
                    if (cred && cred.email && cred.password) {
                        dispatch({type: 'SIGN_IN', payload: cred})
                    }
                    break;
                }
                case 'signInSuccess': {
                    initDomData();
                    dispatch({type: 'OPEN_WORKSPACE'});
                    dispatch({type: 'UPDATE_TABS', payload: serverResponse.headerData});
                    dispatch({type: 'OPEN_MAP', payload: {source: 'SERVER'}});
                    break;
                }
                case 'signInFail': {
                    localStorage.clear();
                    break;
                }
                case 'openMapSuccess': {
                    loadMap(serverResponse.mapStorage);
                    recalc();
                    redraw();
                    break;
                }
                case 'createMapInMapSuccess': {
                    push();
                    nodeDispatch('insertIlinkFromMongo');
                    nodeDispatch('save');
                    redraw();
                    checkPop();
                    break;
                }
                case 'createMapInTabSuccess': {

                    break;
                }
                case 'saveMapRequestSuccess': {
                    break;
                }
                case 'imageSaveSuccess': {
                    // FELTÉVE, hogy továbbfejlesztettük az alaprendszert is fetch-essé...
                    // VAGY pedig külön kell szedni

                    //         push();
                    //         nodeDispatch('newChild');
                    //         nodeDispatch('insertImageFromLinkAsNode');
                    //         redraw();
                    //         checkPop();
                }
            }
        }
    }, [serverResponse]);

    return null;
}
