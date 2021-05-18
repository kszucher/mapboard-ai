import '../component-css/Layout.css'
import React, {useContext, useEffect} from 'react'
import {Context} from "../core/Store";
import {nodeDispatch} from "../core/NodeFlow";
import {checkPop, mapDispatch, mapState, push, redraw} from "../core/MapFlow";
import {initDomData} from "../core/DomFlow";

/**
 * @return {null}
 */
export function Communication() {

    const [state, dispatch] = useContext(Context);
    const {serverAction, serverResponse, mapIdList, mapId, mapSelected, mapStorageOut, userName, userEmail, userPassword} = state;

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
                    case 'signIn':              msg = {cred, cmd: 'signInRequest'};                        break;
                    case 'openMap':             msg = {cred, cmd: 'openMapRequest', mapSelected, mapId};   break;
                    case 'createMapInMap':      msg = {cred, cmd: 'createMapInMapRequest', mapStorageOut}; break;
                    case 'createMapInTab':      msg = {cred, cmd: 'createMapInTabRequest', mapStorageOut}; break;
                    case 'removeMapInTab':      msg = {cred, cmd: 'removeMapInTabRequest'};                break;
                    case 'moveUpMapInTab':      msg = {cred, cmd: 'moveUpMapInTabRequest'};                break;
                    case 'moveDownMapInTab':    msg = {cred, cmd: 'moveDownMapInTabRequest'};              break;
                    case 'saveMap':             msg = {cred, cmd: 'saveMapRequest', mapId, mapStorageOut}; break;
                }
            } else {
                switch (lastAction) {
                    case 'signUp': msg = {userData: {userName, userEmail, userPassword}, cmd: 'signUpRequest'}; break;
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
                    mapState.isLoading = true;
                    mapDispatch('setData', serverResponse.mapStorage.data);
                    mapDispatch('setDensity', serverResponse.mapStorage.density);
                    mapDispatch('setAlignment', serverResponse.mapStorage.alignment);
                    mapDispatch('setTaskConfigWidth');
                    redraw();
                    let mapHolderDiv = document.getElementById('mapHolderDiv');
                    mapHolderDiv.scrollLeft = (window.innerWidth + mapState.mapWidth) / 2;
                    mapHolderDiv.scrollTop = window.innerHeight - 48 * 2;
                    dispatch({type: 'SET_MAPSTORAGE', payload: serverResponse.mapStorage});
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
                case 'updateTabSuccess': { // this will be the reply for createMapInTab, delete, and reord
                    dispatch({type: 'UPDATE_TABS', payload: serverResponse.headerData});
                    dispatch({type: 'OPEN_MAP', payload: {source: 'SERVER'}});
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
