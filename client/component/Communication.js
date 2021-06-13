import '../component-css/Layout.css'
import React, {useContext, useEffect} from 'react'
import {Context, remoteDispatch, remoteGetState} from "../core/Store";
import {nodeDispatch} from "../core/NodeFlow";
import {checkPop, getDefaultMap, mapDispatch, mapState, push, redraw, saveMap} from "../core/MapFlow";
import {initDomData} from "../core/DomFlow";

let waitingForServer = 0;
setInterval(function() {
    if (!waitingForServer && remoteGetState().mapId !== '' && remoteGetState.prevMapId !== '') {
        // remoteDispatch({type: 'SAVE_MAP'})
    }
}, 3000);

/**
 * @return {null}
 */
export function Communication() {

    const [state, dispatch] = useContext(Context);
    const {serverAction, serverActionCntr, serverResponse, serverResponseCntr} = state;

    const callback = response => {
        console.log('SERVER_RESPONSE: ' + response.cmd);
        dispatch({type: 'SERVER_RESPONSE', payload: response});
    }

    const post = (msg) => {
        console.log('SERVER_MESSAGE: ' + msg.serverCmd);
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
        if (!waitingForServer) {
            let {serverCmd, serverPayload} = serverAction;
            if (serverCmd === 'ping') {
                post({serverCmd});
            } else {
                const cred = JSON.parse(localStorage.getItem('cred'));
                if (cred && cred.email && cred.password) {
                    let mapStorageOut = {
                        density: mapState.density,
                        alignment: mapState.alignment
                    };
                    if (['saveOpenMap', 'saveMap', 'saveMapBackup'].includes(serverCmd)) {
                        Object.assign(mapStorageOut, {data: saveMap()});
                    } else if (serverCmd === 'createMapInMap') {
                        Object.assign(mapStorageOut, {data: getDefaultMap(newMapName)});
                    } else if (serverCmd === 'createMapInTab') {
                        Object.assign(mapStorageOut, {data: getDefaultMap('New Map')});
                    }
                    switch (serverCmd) {
                        case 'signIn':                post({cred, serverCmd, serverPayload}); break;
                        case 'openMapFromTabHistory': post({cred, serverCmd, serverPayload}); break;
                        case 'openMapFromTab':        post({cred, serverCmd, serverPayload}); break;
                        case 'openMapFromMap':        post({cred, serverCmd, serverPayload}); break;
                        case 'openMapFromBreadcrumbs':post({cred, serverCmd, serverPayload}); break;

                        case 'openMap':               post({cred, serverCmd, mapId, tabMapSelected}); break;
                        case 'saveOpenMap':           post({cred, serverCmd, prevMapId, mapStorageOut, mapId, tabMapSelected}); break;
                        case 'saveMap':               post({cred, serverCmd, mapId, mapStorageOut}); break;
                        case 'saveMapBackup':         post({cred, serverCmd, mapId, mapStorageOut}); break;

                        case 'createMapInMap':        post({cred, serverCmd, mapStorageOut}); break;
                        case 'createMapInTab':        post({cred, serverCmd, mapStorageOut}); break;
                        case 'removeMapInTab':        post({cred, serverCmd}); break;
                        case 'moveUpMapInTab':        post({cred, serverCmd}); break;
                        case 'moveDownMapInTab':      post({cred, serverCmd}); break;
                    }
                } else {
                    switch (serverCmd) {
                        case 'signUpStep1':           post({serverCmd, userData: serverPayload}); break;
                        case 'signUpStep2':           post({serverCmd, userData: serverPayload}); break;
                    }
                }
            }
        }
    }, [serverActionCntr]);

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
                    dispatch({type: 'OPEN_MAP_FROM_TAB_HISTORY'});
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
                    let {mapStorage} = serverResponse.payload;
                    mapState.isLoading = true;
                    mapDispatch('setMapId', mapStorage._id);
                    mapDispatch('setData', mapStorage.data);
                    mapDispatch('setDensity', mapStorage.density);
                    mapDispatch('setAlignment', mapStorage.alignment);
                    mapDispatch('setTaskConfigWidth');
                    redraw();
                    let mapHolderDiv = document.getElementById('mapHolderDiv');
                    mapHolderDiv.scrollLeft = (window.innerWidth + mapState.mapWidth) / 2;
                    mapHolderDiv.scrollTop = window.innerHeight - 48 * 2;
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
                    dispatch({type: 'UPDATE_TABS', payload: serverResponse.payload});
                    dispatch({type: 'OPEN_MAP', payload: {source: 'SERVER_UPDATE_TABS_SUCCESS'}});
                    break;
                }
                case 'saveMapSuccess': {
                    break;
                }
            }
        }
    }, [serverResponseCntr]);

    return null;
}
