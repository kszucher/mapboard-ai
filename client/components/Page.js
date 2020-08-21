import '../css/Layout.css'
import React, {useEffect, useState} from 'react'
import SignIn from "./SignIn";
import {Workspace} from "./Workspace";
import {eventRouter, lastEvent} from "../core/EventRouter";

export function Page() {
    const [state, setState] = useState({
        isLoggedIn: false
    });

    useEffect(() => {
        if (state.isLoggedIn === false) {
            eventRouter.processEvent({
                type: 'componentEvent',
                ref: {
                    'cmd': 'signInAuto',
                },
            });
        }

        document.addEventListener('toPage', handleChangeExt);
        return () => {document.removeEventListener('toPage', handleChangeExt)}
    });

    const handleChangeExt = (e) => {
        setState({
            isLoggedIn: e.detail.isLoggedIn,
        });
    };

    return (
        state.isLoggedIn===true? <Workspace/> : <SignIn/>
    )
}
