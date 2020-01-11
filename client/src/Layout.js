import './../css/Layout.css'
import React                                                from 'react'
import ReactMaterialToolBar                                 from "../material/ReactMaterialToolBar";
import {ReactMaterialTabHolder}                             from "../material/ReactMaterialTab";
import {mindBoardApi}                                       from "./MindBoardApi";

export function Layout() {

    mindBoardApi.init();
    mindBoardApi.request({
        'cmd': 'signIn',
        'user': 'kryss',
        'pass': 'mncvmncv'
    });

    return (
        <div id="wrapper">
            <div id="header">
                <div id="header-columns">
                    <aside id="header-sidebar-left"/>
                    <main id="header-main">
                        <ReactMaterialToolBar>
                        </ReactMaterialToolBar>
                        <ReactMaterialTabHolder>
                        </ReactMaterialTabHolder>
                    </main>
                    <aside id="header-sidebar-right">
                    </aside>
                </div>
            </div>,
            <aside id="left"> </aside>,
            <aside id="right"> </aside>,
            <div id="center">
                <div id = 'mapDiv' >
                    <canvas id = 'mapCanvas'>
                    </canvas>
                </div>
            </div>
        </div>
    )
}
