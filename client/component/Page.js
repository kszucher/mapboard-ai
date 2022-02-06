import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import { COLORS, getEquationDim, getTextDim, isChrome } from '../core/Utils'
import Auth from "./Auth"
import Logo from "../component-side/Logo"
import Entries from "../component-side/Entries"
import { UndoRedo } from "../component-side/UndoRedo"
import Breadcrumbs from "../component-side/Breadcrumbs"
import { CommandTexts } from "../component-side/CommandTexts"
import { Palette } from "../component-side/Palette"
import { FramesBottom } from "../component-side/FramesBottom"
import { Sharing } from "../component-modal/Sharing"
import { Shares } from "../component-modal/Shares"
import { WindowListeners } from "./WindowListeners"
import { FramesSide } from "../component-side/FramesSide"
import { Profile } from '../component-side/Profile'
import { ProfileEditor } from '../component-modal/ProfileEditor'
import {PAGE_STATES} from "../core/EditorFlow"
import { createTheme, ThemeProvider } from '@mui/material'

const muiTheme = createTheme({
    props: {
        MuiButtonBase: {
            disableRipple: true
        }
    },
    palette: {
        primary: {
            light: '#9040b8',
            main: '#5f0a87',
            dark: '#2e0059',
            contrastText: COLORS.MAP_BACKGROUND,
        },
        secondary: {
            light: '#9040b8',
            main: '#5f0a87',
            dark: '#2e0059',
            contrastText: COLORS.MAP_BACKGROUND,
        },
    },
    spacing: 2,
    typography: {
        fontFamily: 'Comfortaa',
    },
})

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
            <ThemeProvider theme={muiTheme}>
                {[DEMO, WS, WS_SHARES, WS_SHARING, WS_PROFILE].includes(pageState) && <>
                    <Map/>
                    <Logo/>
                    {[WS, WS_SHARES, WS_SHARING, WS_PROFILE].includes(pageState) && <>
                        <Entries/>
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
            </ThemeProvider>
        </div>
    )
}
