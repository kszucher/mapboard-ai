import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import Auth from "./Auth";
import {muiTheme} from "../component-styled/Theme";
import {MuiThemeProvider} from "@material-ui/core";
import Logo from "../component-side/Logo";
import Tabs from "../component-side/Tabs";
import {UndoRedo} from "../component-side/UndoRedo";
import Breadcrumbs from "../component-side/Breadcrumbs";
import {CommandTexts} from "../component-side/CommandTexts";
import {Palette} from "../component-side/Palette";
import {FramesBottom} from "../component-side/FramesBottom";
import {PAGE_STATES} from "../core/EditorFlow";
import {Sharing} from "../component-modal/Sharing";
import {Shares} from "../component-modal/Shares";
import {getEquationDim, getTextDim, isChrome} from "../core/Utils";
import {WindowListeners} from "./WindowListeners";
import {FramesSide} from "../component-side/FramesSide";
import { Profile } from '../component-side/Profile'
import { ProfileEditor } from '../component-modal/ProfileEditor'

export function Page() {
    const pageState = useSelector(state => state.pageState)
    const paletteVisible = useSelector(state => state.paletteVisible)
    const frameEditorVisible = useSelector(state => state.frameEditorVisible)
    const dispatch = useDispatch()
    const {AUTH, DEMO, WS, WS_SHARES, WS_SHARING, WS_PROFILE} = PAGE_STATES;

    useEffect(()=> {
        getTextDim('Test')
        getEquationDim('\\[Test\\]');

        const cred = JSON.parse(localStorage.getItem('cred'))
        if (cred !== null) {
            dispatch({type: 'SIGN_IN', payload: { cred }})
        }
    }, [])

    return (
        <div id="page">
            <MuiThemeProvider theme={muiTheme}>
                {[DEMO, WS, WS_SHARES, WS_SHARING, WS_PROFILE].includes(pageState) && <>
                    <Map/>
                    <Logo/>
                    {[WS, WS_SHARES, WS_SHARING, WS_PROFILE].includes(pageState) && <>
                        <Tabs/>
                        <UndoRedo/>
                        <Profile/>
                        <Breadcrumbs/>
                        <CommandTexts/>
                    </>}
                    {paletteVisible===1 && <Palette/>}
                    {frameEditorVisible===1 && <FramesSide/>}
                    {frameEditorVisible===1 && <FramesBottom/>}
                </>}
                {pageState === AUTH && <Auth/>}
                {pageState === WS_SHARES && <Shares/>}
                {pageState === WS_SHARING && <Sharing/>}
                {pageState === WS_PROFILE && <ProfileEditor/>}
                <WindowListeners/>
            </MuiThemeProvider>
        </div>
    )
}

const Map = () => {
    return (
        <div id='mapHolderDiv' style={{overflowY: 'scroll', overflowX: 'scroll'}}>
            <div
                style={{position: 'relative', paddingTop: '100vh', paddingLeft: '100vw'}}>
                <svg id="mapSvgOuter" style={{position: 'absolute', left: 0, top: 0}}>
                    {isChrome
                        ? <svg id="mapSvgInner" style={{overflow: 'visible'}} x='calc(100vw)' y='calc(100vh)'><Layers/></svg>
                        : <svg id="mapSvgInner" style={{overflow: 'visible', transform: 'translate(calc(100vw), calc(100vh))'}}><Layers/></svg>
                    }
                </svg>
                <div id='mapDiv' style={{position: 'absolute', transitionProperty: 'width, height', display: 'flex', pointerEvents: 'none'}}/>
            </div>
        </div>
    )
}


const Layers = () => {
    return (
        <>
            <g id="layer0"/>
            <g id="layer1"/>
            <g id="layer2"/>
            <g id="layer3"/>
            <g id="layer4"/>
            <g id="layer5"/>
        </>
    )
}
