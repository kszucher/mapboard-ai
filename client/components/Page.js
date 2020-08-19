import '../css/Layout.css'
import React, {useEffect, useState} from 'react'
import SignIn from "../components/ReactMaterialSignIn";
import {Workspace} from "./Workspace";

export function Page() {
    const [state, setState] = useState({
        isLoggedIn: false
    });

    useEffect(() => {
        document.addEventListener('toPage', handleChangeExt);
        return () => {document.removeEventListener('toPage', handleChangeExt)}
    });

    const handleChangeExt = (e) => {
        setState({
            isLoggedIn: true
        });
    };

    return (
        state.isLoggedIn===true? <Workspace/> : <SignIn/>
    )
}
