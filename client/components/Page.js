import '../css/Layout.css'
import React, {useContext, useEffect, useState} from 'react'
import SignIn from "./SignIn";
import {Workspace} from "./Workspace";
import {Context} from "../core/Store";
import {windowHandler} from "../core/WindowHandler";
import {initDomData, recalc, redraw} from "../map/Map";
import {eventEmitter} from "../core/EventEmitter";

export function Page() {

    const [state, dispatch] = useContext(Context);

    const {isLoggedIn, email, password, serverResponse} = state;

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
        post(obj, response => dispatch({type: 'SERVER_RESPONSE', payload:response}));
    };

    useEffect(() => {
        let cred = JSON.parse(localStorage.getItem('cred'));
        if (cred !== null) {
            dispatch({type: 'SIGN_IN', payload: {email: cred.name, password: cred.pass}})
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cred', JSON.stringify({
            name: email,
            pass: password,
        }));
        commSend({
            'cmd': 'signInRequest',
            'cred': JSON.parse(localStorage.getItem('cred')),
        });
    }, [email, password]);

    // useEffect(() => {
    //     if (isLoggedIn) {
    //         windowHandler.addListeners();
    //     } else {
    //         windowHandler.removeListeners();
    //     }
    // }, [isLoggedIn]);

    useEffect(() => {
        switch (serverResponse.cmd) {
            case 'signInSuccess': {
                initDomData();
                // eventEmitter('updatePageToWorkspace');
                // eventEmitter('updateTabs');
                // eventEmitter('openAfterInit');

                dispatch({type: 'IS_LOGGED_IN_TRUE'});

                break;
            }
            case 'signInFail': {
                console.log(localStorage);
                break;
            }
            case 'signOutSuccess': {
                windowHandler.removeListeners();
                localStorage.clear();
                eventEmitter('updatePageToSignIn');
                break;
            }
            case 'openMapSuccess': {
                windowHandler.removeListeners();
                windowHandler.addListeners();
                eventEmitter('openMap');
                recalc();
                redraw();
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
