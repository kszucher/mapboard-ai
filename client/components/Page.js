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

    const {isLoggedIn, email, password, serverResponse, tabListIds, tabListSelected, lastUserMap, mapStorage} = state;

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
        if (cred.used) {
            dispatch({type: 'UPDATE_CREDENTIALS', payload: {email: cred.name, password: cred.pass}})
        }
    }, []);

    useEffect(() => {
        if (email !== '' && password !== '') {
            localStorage.setItem('cred', JSON.stringify({
                name: email,
                pass: password,
                used: 1,
            }));
            commSend({
                'cmd': 'signInRequest',
                'cred': JSON.parse(localStorage.getItem('cred')),
            });
        }
    }, [email, password]);

    useEffect(() => {
        if (isLoggedIn) {
            windowHandler.addListeners();
        } else {
            windowHandler.removeListeners();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        switch (serverResponse.cmd) {
            case 'signInSuccess': {
                initDomData();
                dispatch({type: 'IS_LOGGED_IN_TRUE'});
                dispatch({type: 'SET_TAB_LIST_IDS', payload: serverResponse.headerData.headerMapIdList});
                dispatch({type: 'SET_TAB_LIST_NAMES', payload: serverResponse.headerData.headerMapNameList});
                dispatch({type: 'SET_TAB_LIST_SELECTED', payload: serverResponse.headerData.headerMapSelected});
                break;
            }
            case 'signInFail': {
                console.log(localStorage);
                break;
            }
            case 'signOutSuccess': {
                // localStorage.clear();

                // eventEmitter('updatePageToSignIn'); // LOGOUT magyarul
                break;
            }
            case 'openMapSuccess': {
                dispatch({type: 'SET_LAST_USER_MAP', payload: serverResponse.mapName});
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

    useEffect(() => {
        // shouldAddToHistory = 1; // TODO!!!
        if (isLoggedIn) {
            commSend({
                'cmd': 'openMapRequest',
                'cred': JSON.parse(localStorage.getItem('cred')),
                'mapName': tabListIds[tabListSelected]
            });
        }
    }, [tabListSelected]);

    useEffect(() => {
        if (mapStorage.hasOwnProperty('data')) {

            // if (shouldAddToHistory === 1) { // TODO!!!
            //     history.pushState({lastUserMap: lastUserMap}, lastUserMap, '');
            // }

            loadMap(mapStorage);
            recalc();
            redraw();
        }

    }, [mapStorage]);


    return(
        isLoggedIn
            ? <Workspace/>
            : <SignIn/>
    )
}
