import '../component-css/Layout.css'
import React, {useContext, useEffect} from 'react'
import {Context, remoteGetState} from "../core/Store";
import {mapDispatch, redraw, saveMap} from "../core/MapFlow";
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
                    switch (serverCmd) {
                        case 'signIn':                      post({cred, serverCmd, serverPayload}); break;
                        case 'openMapFromTabHistory':       post({cred, serverCmd, serverPayload}); break;
                        case 'saveOpenMapFromTab':          post({cred, serverCmd, serverPayload}); break;
                        case 'saveOpenMapFromMap':          post({cred, serverCmd, serverPayload}); break;
                        case 'saveOpenMapFromBreadcrumbs':  post({cred, serverCmd, serverPayload}); break;
                        case 'saveMap':                     post({cred, serverCmd, serverPayload}); break;
                        case 'addMapPlayback':              post({cred, serverCmd, serverPayload}); break;
                        case 'createMapInMap':              post({cred, serverCmd, serverPayload}); break;
                        case 'createMapInTab':              post({cred, serverCmd, serverPayload}); break;
                        case 'removeMapInTab':              post({cred, serverCmd, serverPayload}); break;
                        case 'moveUpMapInTab':              post({cred, serverCmd, serverPayload}); break;
                        case 'moveDownMapInTab':            post({cred, serverCmd, serverPayload}); break;
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
                        localStorage.setItem('cred', JSON.stringify(cred))
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
                    mapDispatch('setMapStorage', mapStorage);
                    redraw();
                    break;
                }
                case 'saveMapSuccess': {
                    break;
                }
                case 'addMapPlaybackSuccess': {
                    break;
                }
            }
        }
    }, [serverResponseCntr]);

    return null;
}
