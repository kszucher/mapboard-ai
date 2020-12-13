import '../css/Layout.css'
import React, {useContext, useEffect} from 'react'
import SignIn from "./SignIn";
import {Workspace} from "./Workspace";
import {Context, remoteGetState} from "../core/Store";
import {windowHandler} from "../core/WindowHandler";
import {initDomData, loadMap, recalc, redraw} from "../map/Map";
import {eventEmitter} from "../core/EventEmitter";
import {communication} from "../core/Communication";

export function Page() {

    const [state, dispatch] = useContext(Context);

    const {credentialsChanged, isLoggedIn, serverResponse, tabListIds, tabListNames, tabListSelected,
        mapId, mapStorage, isSaved, mapStorageOut} = state;

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
                const {headerMapIdList, headerMapNameList, headerMapSelected} = serverResponse.headerData;
                dispatch({type: 'LOG_IN'});
                dispatch({type: 'SET_TAB_LIST_IDS', payload: headerMapIdList});
                dispatch({type: 'SET_TAB_LIST_NAMES', payload: headerMapNameList});
                dispatch({type: 'SET_TAB_LIST_SELECTED', payload: headerMapSelected});
                dispatch({type: 'SET_MAP_ID', payload: {
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
                dispatch({type: 'SET_MAP_STORAGE', payload: serverResponse.mapStorage});
                break;
            }
            case 'writeMapRequestSuccess': {
                console.log('save success');
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

    useEffect(() => {
        if (isLoggedIn) {
            commSend({
                cmd: 'writeMapRequest',
                cred: JSON.parse(localStorage.getItem('cred')),
                mapName: remoteGetState().mapId,
                mapStorage: mapStorageOut
            });
        }
    }, [isSaved]);

    return(
        isLoggedIn
            ? <Workspace/>
            : <SignIn/>
    )
}
