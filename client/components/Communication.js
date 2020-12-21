import '../css/Layout.css'
import React, {useContext, useEffect} from 'react'
import {Context} from "../core/Store";
import {checkPop, initDomData, loadMap, push, recalc, redraw} from "../map/Map";
import {nodeDispatch} from "../core/NodeReducer";

/**
 * @return {null}
 */
export function Communication() {

    const [state, dispatch] = useContext(Context);
    const {serverAction, serverResponse, mapId, mapStorageOut} = state;

    const post = (message, callback) => {
        let myUrl = process.env.NODE_ENV === 'development' ? "http://127.0.0.1:8082/beta" : "https://mindboard.io/beta";
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
                callback(JSON.parse(xmlHttp.responseText));
        };
        xmlHttp.open("POST", myUrl, true); // true for asynchronous
        xmlHttp.send(JSON.stringify(message));
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
                    case 'signIn':          msg = {cmd: 'signInRequest',         cred};                       break;
                    case 'openMap':         msg = {cmd: 'openMapRequest',        cred, mapId};                break;
                    case 'createMapInMap':  msg = {cmd: 'createMapInMapRequest', cred, mapStorageOut};        break;
                    case 'createMapInTab':  msg = {cmd: 'createMapInTabRequest', cred, mapStorageOut};        break;
                    case 'saveMap':         msg = {cmd: 'saveMapRequest',        cred, mapId, mapStorageOut}; break;
                }
            }
        }
        console.log('SERVER_MESSAGE: ' + msg.cmd);
        post(msg, response => dispatch({type: 'SERVER_RESPONSE', payload: response}));
    }, [serverAction]);

    useEffect(() => {
        if (serverResponse.cmd) {
            console.log('SERVER_RESPONSE: ' + serverResponse.cmd);
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
                    nodeDispatch('insertIlinkFromMongo', serverResponse.newMapId);
                    redraw();
                    checkPop();
                    dispatch({type: 'SAVE_MAP'});
                    break;
                }
                case 'createMapInTabSuccess': {
                    dispatch({type: 'UPDATE_TABS', payload: serverResponse.headerData});
                    break;
                }
                case 'saveMapRequestSuccess': {
                    break;
                }
            }
        }
    }, [serverResponse]);

    return null;
}
