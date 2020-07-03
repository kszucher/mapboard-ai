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
        <div id="wrapper">
            <div id="left">
                <ReactMaterialToolBar>
                </ReactMaterialToolBar>
                <ReactMaterialVerticalTabs/>
            </div>,
            <div id="center">
                <div id='mapDiv'>
                    <canvas id='mapCanvas'/>
                    <svg id="mapSvg"/>
                </div>
            </div>
            <div id="right">
            </div>,
        </div>
    )
}
