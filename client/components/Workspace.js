import '../css/Layout.css'
import React, { useEffect,} from 'react'
import ReactMaterialToolBar from "../components/ReactMaterialToolBar";
import ReactMaterialVerticalTabs from "../components/ReactMaterialVerticalTabs";
import {windowHandler} from "../core/WindowHandler";

export function Workspace() {
    useEffect(() => {
        windowHandler.addListeners();
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
