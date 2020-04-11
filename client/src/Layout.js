import './../css/Layout.css'
import React, {useEffect} from 'react'
import ReactMaterialToolBar from "../material/ReactMaterialToolBar";
import {SimpleTabs} from "../material/ReactMaterialTabs";
import {windowHandler} from "./WindowHandler";
import {eventRouter} from "./EventRouter";

export function Layout() {


    useEffect(() => {

        let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d",           "M375,261 C403,261 397,77 425,75");
        path.setAttribute("fill",            "transparent");
        path.setAttribute("stroke",            "#bbbbbb");
        path.setAttribute("stroke-width",            "1"  );
        path.setAttribute("vector-effect",            "non-scaling-stroke"  );

        let svg = document.getElementById('mapSvg');
        svg.appendChild(path);
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
            <div id="header">
                <div id="header-columns">
                    <aside id="header-sidebar-left"/>
                    <main id="header-main">
                        <ReactMaterialToolBar>
                        </ReactMaterialToolBar>
                        <SimpleTabs>
                        </SimpleTabs>
                    </main>
                    <aside id="header-sidebar-right">
                    </aside>
                </div>
            </div>,
            <aside id="left"> </aside>,
            <aside id="right"> </aside>,
            <div id="center">
                <div id='mapDiv'>
                    <canvas id='mapCanvas'>
                    </canvas>
                    <svg id="mapSvg">
                    </svg>
                </div>
            </div>
        </div>
    )
}
