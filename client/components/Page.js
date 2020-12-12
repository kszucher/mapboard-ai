import '../css/Layout.css'
import React, {useContext, useEffect} from 'react'
import SignIn from "./SignIn";
import {Workspace} from "./Workspace";
import {Context} from "../core/Store";
import {windowHandler} from "../core/WindowHandler";
import {initDomData, loadMap, recalc, redraw} from "../map/Map";
import {eventEmitter} from "../core/EventEmitter";

export function Page() {

    const [state, dispatch] = useContext(Context);

    const {credentialsChanged, isLoggedIn, serverResponse, tabListIds, tabListSelected, mapId, mapStorage} = state;

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

    const commSend = (obj) => {
        post(obj, response => dispatch({type: 'SERVER_RESPONSE', payload: response}));
    };

    useEffect(() => {
        let cred = JSON.parse(localStorage.getItem('cred'));
        if (cred && cred.email && cred.password) {
            dispatch({type: 'UPDATE_CREDENTIALS', payload: {email: cred.email, password: cred.password}})
        }
    }, []);

    useEffect(() => {
        let cred = JSON.parse(localStorage.getItem('cred'));
        if (cred && cred.email && cred.password) {
            commSend({
                'cmd': 'signInRequest',
                'cred': cred
            });
        }
    }, [credentialsChanged]);

    useEffect(() => {
        if (isLoggedIn) {
            windowHandler.addListeners();
        } else {
            windowHandler.removeListeners();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch({type: 'SET_MAP_ID', payload: {mapId: tabListIds[tabListSelected], pushHistory: true}})
        }
    }, [tabListSelected]);

    useEffect(() => {
        if (isLoggedIn) {
            commSend({
                'cmd': 'openMapRequest',
                'cred': JSON.parse(localStorage.getItem('cred')),
                'mapName': mapId
            });
        }
    }, [mapId]);

    useEffect(() => {
        if (mapStorage.hasOwnProperty('data')) {
            loadMap(mapStorage);
            recalc();
            redraw();
        }
    }, [mapStorage]);

    useEffect(() => {
        switch (serverResponse.cmd) {
            case 'signInSuccess': {
                initDomData();
                dispatch({type: 'LOG_IN'});
                dispatch({type: 'SET_TAB_LIST_IDS', payload: serverResponse.headerData.headerMapIdList});
                dispatch({type: 'SET_TAB_LIST_NAMES', payload: serverResponse.headerData.headerMapNameList});
                dispatch({type: 'SET_TAB_LIST_SELECTED', payload: serverResponse.headerData.headerMapSelected});
                break;
            }
            case 'signInFail': {
                console.log('sign in attempt failed');
                // console.log(localStorage);
                // localStorage.clear();
                break;
            }
            case 'openMapSuccess': {
                dispatch({type: 'SET_MAP_STORAGE', payload: serverResponse.mapStorage});
                break;
            }
            case 'writeMapRequestSuccess': {
                break;
            }
            case 'createMapInTabSuccess': {
                eventEmitter('updateTabs');
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
        }
    }, [serverResponse]);

    return(
        isLoggedIn
            ? <Workspace/>
            : <SignIn/>
    )
}
