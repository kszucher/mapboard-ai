import './../css/Layout.css'
import React, {useEffect} from 'react'
import ReactMaterialToolBar from "../material/ReactMaterialToolBar";
import {windowHandler} from "./WindowHandler";
import {eventRouter} from "./EventRouter";
import ReactMaterialVerticalTabs from "../material/ReactMaterialVerticalTabs";

export function Layout() {

    useEffect(() => {
    });

    windowHandler.addListeners();
    eventRouter.processEvent({
        type: 'materialEvent',
        ref: {
            'cmd': 'signIn',
            'user': 'kryss',
            'pass': 'mncvmncv'
        },
    });

    return (
        <div id="page">
            <div id="left">
                <div id = 'left-top'>
                    <ReactMaterialToolBar/>
                </div>
                <div id='left-bottom'>
                    <ReactMaterialVerticalTabs/>
                </div>
            </div>
            <div id="right">
                <div id = "right-top"/>
                <div id = "right-bottom">
                    <div id='mapDiv'>
                        <svg id="mapSvg"/>
                    </div>
                </div>
            </div>
        </div>
    )
}
