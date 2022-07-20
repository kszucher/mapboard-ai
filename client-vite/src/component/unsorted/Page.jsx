import {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import { getEquationDim, getTextDim, isChrome } from '../../core/Utils'
import Auth from "./Auth"
import Logo from "../side/Logo"
import TabMaps from "../side/TabMaps"
import Breadcrumbs from "../side/BreadcrumbMaps"
import { Formatter } from "../side/Formatter"
import { FrameCarousel } from "../side/FrameCarousel"
import { ShareThisMap } from "../modal/ShareThisMap"
import { Shares } from "../modal/Shares"
import { WindowListeners } from "./WindowListeners"
import { ControlsRight } from '../side/ControlsRight'
import { createTheme, ThemeProvider } from '@mui/material'
import { UndoRedo } from '../side/UndoRedo'
import { Profile } from '../side/Profile'
import { ControlsLeft } from '../side/ControlsLeft'
import { UpdateMapInMap } from '../modal/UpdateMapInMap'
import { CreateTable } from '../modal/CreateTable'
import {PAGE_STATES} from "../../core/EditorFlow"
import { UpdateTask } from '../modal/UpdateTask'
import { Settings } from '../modal/Settings'

const getMuiTheme = colorMode  => createTheme({
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
    const {AUTH, EMPTY, DEMO} = PAGE_STATES;

    useEffect(()=> {
        getTextDim('Test')
        getEquationDim('\\[Test\\]')
        const cred = JSON.parse(localStorage.getItem('cred'))
        if (cred !== null) {
            // TODO type check
            dispatch({type: 'SIGN_IN', payload: { cred }})
        }
    }, [])

    return (
        <div id="page">
            <ThemeProvider theme={getMuiTheme(colorMode)}>
                {pageState === AUTH && <Auth/>}
                {
                    ![AUTH, EMPTY].includes(pageState) &&
                    <>
                        <Map/>
                        <Logo/>
                        <Profile/>
                        {
                            ![AUTH, EMPTY, DEMO].includes(pageState) &&
                            <>
                                <UndoRedo/>
                                <Breadcrumbs/>
                                <TabMaps/>
                                <ControlsLeft/>
                                <ControlsRight/>
                            </>
                        }
                        {formatMode!=='' && <Formatter/>}
                        {frameEditorVisible && <FrameCarousel/>}
                    </>
                }
                {pageState === PAGE_STATES.WS_SHARES && <Shares/>}
                {pageState === PAGE_STATES.WS_SHARING && <ShareThisMap/>}
                {pageState === PAGE_STATES.WS_CREATE_MAP_IN_MAP && <UpdateMapInMap/>}
                {pageState === PAGE_STATES.WS_CREATE_TABLE && <CreateTable/>}
                {pageState === PAGE_STATES.WS_CREATE_TASK && <UpdateTask/>}
                {pageState === PAGE_STATES.WS_SETTINGS && <Settings/>}
                <WindowListeners/>
            </ThemeProvider>
        </div>
    )
}
