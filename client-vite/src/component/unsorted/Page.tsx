import {useEffect} from 'react'
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
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
import { ProfileButton } from '../side/ProfileButton'
import { ControlsLeft } from '../side/ControlsLeft'
import { ShouldCreateMapInMap } from '../modal/ShouldCreateMapInMap'
import { CreateTable } from '../modal/CreateTable'
import {PAGE_STATES} from "../../core/EditorFlow"
import { ShouldUpdateTask } from '../modal/ShouldUpdateTask'
import { Settings } from '../modal/Settings'
import { Profile } from '../modal/Profile'

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
    const colorMode = useSelector((state: RootStateOrAny) => state.colorMode)
    const pageState = useSelector((state: RootStateOrAny) => state.pageState)
    const formatMode = useSelector((state: RootStateOrAny) => state.formatMode)
    const frameEditorVisible = useSelector((state: RootStateOrAny) => state.frameEditorVisible)
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
                        <ProfileButton/>
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
                {pageState === PAGE_STATES.WS_PROFILE && <Profile/>}
                {pageState === PAGE_STATES.WS_SETTINGS && <Settings/>}
                {pageState === PAGE_STATES.WS_SHARES && <Shares/>}
                {pageState === PAGE_STATES.WS_CREATE_MAP_IN_MAP && <ShouldCreateMapInMap/>}
                {pageState === PAGE_STATES.WS_CREATE_TABLE && <CreateTable/>}
                {pageState === PAGE_STATES.WS_CREATE_TASK && <ShouldUpdateTask/>}
                {pageState === PAGE_STATES.WS_SHARE_THIS_MAP && <ShareThisMap/>}

                <WindowListeners/>
            </ThemeProvider>
        </div>
    )
}
