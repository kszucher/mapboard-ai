import '../component-css/Layout.css'
import React, {useContext, useEffect} from 'react'
import {Context, remoteDispatch, remoteGetState} from "../core/Store";
import {nodeDispatch} from "../core/NodeFlow";
import {checkPop, getDefaultMap, mapDispatch, mapState, push, redraw, saveMap} from "../core/MapFlow";
import {initDomData} from "../core/DomFlow";

let waitingForServer = 0;
setInterval(function() {
    if (!waitingForServer && remoteGetState().mapId !== '') {
        // remoteDispatch({type: 'SAVE_MAP'})
    }
}, 3000);

/**
 * @return {null}
 */
export function Communication() {

    const [state, dispatch] = useContext(Context);
    const {serverAction, serverResponse, mapId, prevMapId, mapSelected, userName, userEmail, userPassword, userConfirmationCode, newMapName} = state;

    const callback = response => {
        console.log('SERVER_RESPONSE: ' + response.cmd);
        dispatch({type: 'SERVER_RESPONSE', payload: response});
    }

    const post = (msg) => {
        console.log('SERVER_MESSAGE: ' + msg.cmd);
        waitingForServer = 1;
        let myUrl = process.env.NODE_ENV === 'development'
            ? "http://127.0.0.1:8082/beta"
            : "https://mindboard.io/beta";
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                waitingForServer = 0;
                callback(JSON.parse(xmlHttp.responseText));
            }
        };
        xmlHttp.open("POST", myUrl, true); // true for asynchronous
        xmlHttp.send(JSON.stringify(msg));
    };

    useEffect(() => {
        let lastAction = [...serverAction].pop();
        if (lastAction === 'ping') {
            post({cmd: 'pingRequest'});
        } else {
            const cred = JSON.parse(localStorage.getItem('cred'));
            if (cred && cred.email && cred.password) {
                let mapStorageOut = {
                    density: mapState.density,
                    alignment: mapState.alignment
                };
                if (['saveOpenMap', 'saveMap', 'saveMapBackup'].includes(lastAction)) {
                    Object.assign(mapStorageOut, {data: saveMap()});
                } else if (lastAction === 'createMapInMap') {
                    Object.assign(mapStorageOut, {data: getDefaultMap(newMapName)});
                } else if (lastAction === 'createMapInTab') {
                    Object.assign(mapStorageOut, {data: getDefaultMap('New Map')});
                }
                switch (lastAction) {
                    case 'signIn':              post({cred, cmd: 'signInRequest'}); break;
                    case 'openMap':             post({cred, cmd: 'openMapRequest', mapSelected, mapId}); break;
                    case 'saveOpenMap':         post({cred, cmd: 'saveMapRequest', mapId: prevMapId, mapStorageOut});
                                                post({cred, cmd: 'openMapRequest', mapSelected, mapId}); break;
                    case 'saveMap':             post({cred, cmd: 'saveMapRequest', mapId, mapStorageOut}); break;
                    case 'saveMapBackup':       post({cred, cmd: 'saveMapBackupRequest', mapId, mapStorageOut}); break;
                    case 'createMapInMap':      post({cred, cmd: 'createMapInMapRequest', mapStorageOut}); break;
                    case 'createMapInTab':      post({cred, cmd: 'createMapInTabRequest', mapStorageOut}); break;
                    case 'removeMapInTab':      post({cred, cmd: 'removeMapInTabRequest'}); break;
                    case 'moveUpMapInTab':      post({cred, cmd: 'moveUpMapInTabRequest'}); break;
                    case 'moveDownMapInTab':    post({cred, cmd: 'moveDownMapInTabRequest'}); break;
                }
            } else {
                switch (lastAction) {
                    case 'signUpStep1':         post({userData: {userName, userEmail, userPassword}, cmd: 'signUpStep1Request'}); break;
                    case 'signUpStep2':         post({userData: {userEmail, userConfirmationCode}, cmd: 'signUpStep2Request'}); break;
                }
            }
        }
    }, [serverAction]);

    useEffect(() => {
        if (serverResponse.cmd) {
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
                    dispatch({type: 'OPEN_MAP', payload: {source: 'SERVER_SIGN_IN_SUCCESS'}});
                    break;
                }
                case 'signInFail': {
                    localStorage.clear();
                    break;
                }
                case 'signUpStep1FailEmailAlreadyInUse':
                case 'signUpStep1Success':
                case 'signUpStep2FailUnknownUser':
                case 'signUpStep2FailWrongCode':
                case 'signUpStep2FailAlreadyActivated':
                case 'signUpStep2Success': {
                    dispatch({type: 'SERVER_RESPONSE_TO_USER', payload: serverResponse.cmd});
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
                    // dispatch({type: 'SAVE_MAP'})
                    break;
                }
                case 'updateTabSuccess': { // this will be the reply for createMapInTab, delete, and reord
                    dispatch({type: 'UPDATE_TABS', payload: serverResponse.headerData});
                    dispatch({type: 'OPEN_MAP', payload: {source: 'SERVER_UPDATE_TABS_SUCCESS'}});
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
