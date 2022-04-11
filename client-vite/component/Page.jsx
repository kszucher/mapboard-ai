import {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import { getEquationDim, getTextDim, isChrome } from '../core/Utils'
import Auth from "./Auth"
import Logo from "../component-side/Logo"
import TabMaps from "../component-side/TabMaps"
import { UndoRedo } from "../component-side/UndoRedo"
import Breadcrumbs from "../component-side/BreadcrumbMaps"
import { CommandTexts } from "../component-side/CommandTexts"
import { Palette } from "../component-side/Palette"
import { FramesBottom } from "../component-side/FramesBottom"
import { Sharing } from "../component-modal/Sharing"
import { Shares } from "../component-modal/Shares"
import { WindowListeners } from "./WindowListeners"
import { FramesSide } from "../component-side/FramesSide"
import { IconBar } from '../component-side/IconBar'
import { ProfileEditor } from '../component-modal/ProfileEditor'
import {PAGE_STATES} from "../core/EditorFlow"
import { createTheme, ThemeProvider } from '@mui/material'

const getMuiTheme = colorMode  => createTheme({
    // props: {
    //     MuiButtonBase: {
    //         disableRipple: true
    //     }
    // },
    palette: {
        mode: colorMode,
        primary: {
            main: colorMode === 'light' ? '#5f0a87' : '#dddddd',
        },
        secondary: {
            main: colorMode === 'light' ? '#5f0a87' : '#dddddd',
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
    const colorMode = useSelector(state => state.colorMode)
    const pageState = useSelector(state => state.pageState)
    const formatMode = useSelector(state => state.formatMode)
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
            <ThemeProvider theme={getMuiTheme(colorMode)}>
                {[DEMO, WS, WS_SHARES, WS_SHARING, WS_PROFILE].includes(pageState) && <>
                    <Map/>
                    <Logo/>
                    {[WS, WS_SHARES, WS_SHARING, WS_PROFILE].includes(pageState) && <>
                        <TabMaps/>
                        <UndoRedo/>
                        <IconBar/>
                        <Breadcrumbs/>
                        <CommandTexts/>
                    </>}
                    {formatMode!=='' && <Palette/>}
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
