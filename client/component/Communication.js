import '../css/Layout.css'
import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {initDomData} from "../core/DomFlow";
import {mapDispatch, redraw} from "../core/MapFlow";

let waitingForServer = 0;

/**
 * @return {null}
 */
export function Communication() {
    const serverAction = useSelector(state => state.serverAction)
    const serverActionCntr = useSelector(state => state.serverActionCntr)
    const serverResponse = useSelector(state => state.serverResponse)
    const serverResponseCntr = useSelector(state => state.serverResponseCntr)
    const dispatch = useDispatch()

    const callback = response => {
        console.log('SERVER_RESPONSE: ' + response.cmd);
        dispatch({type: 'SERVER_RESPONSE', payload: response});
    }

    const post = (msg) => {
        console.log('SERVER_MESSAGE: ' + msg.serverCmd);
        waitingForServer = 1;
        let myUrl = process.env.NODE_ENV === 'development'
            ? "http://127.0.0.1:8082/beta"
            : "https://mapboard-server.herokuapp.com/beta";
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
            post ({...serverAction, queryString: window.location.search});
        }
    }, [serverActionCntr]);

    useEffect(() => {
        if (serverResponse.cmd) {
            switch (serverResponse.cmd) {
                case 'pingSuccess': {
                    const cred = JSON.parse(localStorage.getItem('cred'));
                    if (cred && cred.email && cred.password) {
                        localStorage.setItem('cred', JSON.stringify(cred))
                        dispatch({type: 'SIGN_IN'})
                    }
                    break;
                }
                case 'signInSuccess': {
                    initDomData();
                    dispatch({type: 'SHOW_WS'});
                    break;
                }
                case 'authFail': {
                    localStorage.clear();
                    break;
                }
            }
        }
        if (serverResponse.payload) {
            const serverState = serverResponse.payload;
            if (serverState.hasOwnProperty('landingData') &&
                serverState.hasOwnProperty('mapRight')) {
                const {landingData, mapRight} = serverState;
                initDomData();
                dispatch({type: 'SET_LANDING_DATA', payload: {landingData, mapRight}})
            }
            if (serverState.hasOwnProperty('mapId') &&
                serverState.hasOwnProperty('mapSource') &&
                serverState.hasOwnProperty('mapStorage') &&
                serverState.hasOwnProperty('mapRight')) {
                const {mapId, mapSource, mapStorage, mapRight} = serverState;
                let frameSelected = serverState.hasOwnProperty('frameSelected') ? serverState.frameSelected : 0;
                dispatch({type: 'AFTER_OPEN', payload: {mapSource, mapRight}})
                mapDispatch('initMapState', {mapId, mapSource, mapStorage, frameSelected});
                redraw();
            }
            if (serverState.hasOwnProperty('frameLen') &&
                serverState.hasOwnProperty('frameSelected')) {
                const {frameLen, frameSelected} = serverState;
                dispatch({type: 'SET_FRAME_INFO', payload: {frameLen, frameSelected}})
            }
            if (serverState.hasOwnProperty('breadcrumbMapNameList')) {
                const {breadcrumbMapNameList} = serverState;
                dispatch({type: 'SET_BREADCRUMB_DATA', payload: {breadcrumbMapNameList}})
            }
            if (serverState.hasOwnProperty('tabMapNameList') &&
                serverState.hasOwnProperty('tabMapSelected')) {
                const {tabMapNameList, tabMapSelected} = serverState;
                dispatch({type: 'SET_TAB_DATA', payload: {tabMapNameList, tabMapSelected}})
            }
            if (serverState.hasOwnProperty('shareDataExport') &&
                serverState.hasOwnProperty('shareDataImport')) {
                const {shareDataExport, shareDataImport} = serverState;
                dispatch({type: 'SET_SHARE_DATA', payload: {shareDataExport, shareDataImport}})
            }
        }
    }, [serverResponseCntr])

    return null;
}
