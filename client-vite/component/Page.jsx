import {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import { getEquationDim, getTextDim, isChrome } from '../core/Utils'
import Auth from "./Auth"
import Logo from "./Logo"
import TabMaps from "./TabMaps"
import Breadcrumbs from "./BreadcrumbMaps"
import { Formatter } from "./Formatter"
import { Frames } from "./Frames"
import { Sharing } from "./Sharing"
import { Shares } from "./Shares"
import { WindowListeners } from "./WindowListeners"
import { SideBar } from './SideBar'
import { ProfileEditor } from './ProfileEditor'
import {PAGE_STATES} from "../core/EditorFlow"
import { createTheme, ThemeProvider } from '@mui/material'
import { CreateMapInMap } from './CreateMapInMap'
import { UndoRedo } from './UndoRedo'
import { Profile } from './Profile'
import { TasMapsControl } from './TasMapsControl'

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
    const {AUTH, EMPTY, DEMO, WS_SHARES, WS_SHARING, WS_PROFILE, WS_CREATE_MAP_IN_MAP} = PAGE_STATES;

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
                {pageState === AUTH && <Auth/>}
                {![AUTH, EMPTY].includes(pageState) && <>
                    <Map/>
                    <Logo/>
                    {![AUTH, EMPTY, DEMO].includes(pageState) && <>
                        <TabMaps/>
                        <TasMapsControl/>
                        <UndoRedo/>
                        <Profile/>
                        <SideBar/>
                        <Breadcrumbs/>
                    </>}
                    {formatMode!=='' && <Formatter/>}
                    {frameEditorVisible===1 && <Frames/>}
                </>}
                {pageState === WS_SHARES && <Shares/>}
                {pageState === WS_SHARING && <Sharing/>}
                {pageState === WS_PROFILE && <ProfileEditor/>}
                {pageState === WS_CREATE_MAP_IN_MAP && <CreateMapInMap/>}
                <WindowListeners/>
            </ThemeProvider>
        </div>
    )
}
