import React, {FC, useEffect} from 'react'
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {isChrome} from '../core/Utils'
import {Auth} from "./Auth"
import {Logo} from "./Logo"
import {TabMaps} from "./TabMaps"
import {BreadcrumbMaps} from "./BreadcrumbMaps"
import {Formatter} from "./Formatter"
import {FrameCarousel} from "./FrameCarousel"
import {ShareThisMap} from "./ShareThisMap"
import {Shares} from "./Shares"
import {WindowListeners} from "./WindowListeners"
import {ControlsRight} from './ControlsRight'
import {createTheme, PaletteMode, ThemeProvider} from '@mui/material'
import {UndoRedo} from './UndoRedo'
import {ProfileButton} from './ProfileButton'
import {ControlsLeft} from './ControlsLeft'
import {ShouldCreateMapInMap} from './ShouldCreateMapInMap'
import {CreateTable} from './CreateTable'
import {defaultUseOpenWorkspaceQueryState} from "../core/EditorFlow"
import {ShouldUpdateTask} from './ShouldUpdateTask'
import {Settings} from './Settings'
import {Profile} from './Profile'
import {PageState} from "../core/Types";
import {getEquationDim, getTextDim} from "../core/DomUtils";
import {useOpenWorkspaceQuery} from "../core/Api";
import {Layers} from "./Layers";

const getMuiTheme = (colorMode: string)  => createTheme({
  palette: {
    mode: colorMode as PaletteMode,
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

const Map: FC = () => {

  const m = useSelector((state: RootStateOrAny) => state.editor.mapStackData[state.editor.mapStackDataIndex])

  return (
    <div id='mapHolderDiv' style={{overflowY: 'scroll', overflowX: 'scroll'}}>
      <div
        style={{position: 'relative', paddingTop: '100vh', paddingLeft: '100vw'}}>
        <svg
          id="mapSvgOuter"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 'calc(200vw + ' + m.g.mapWidth + 'px)',
            height: 'calc(200vh + ' + m.g.mapHeight + 'px)'
          }}>
          {isChrome
            ?
            <svg id="mapSvgInner" style={{overflow: 'visible'}} x='calc(100vw)' y='calc(100vh)'>
              <Layers/>
            </svg>
            :
            <svg id="mapSvgInner" style={{overflow: 'visible', transform: 'translate(calc(100vw), calc(100vh))'}}>
              <Layers/>
            </svg>
          }
        </svg>
        <div id='mapDiv' style={{position: 'absolute', transitionProperty: 'width, height', display: 'flex', pointerEvents: 'none'}}/>
      </div>
    </div>
  )
}

export const Page: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const formatterVisible = useSelector((state: RootStateOrAny) => state.editor.formatterVisible)
  const mapStackData = useSelector((state: RootStateOrAny) => state.editor.mapStackData)
  const m = useSelector((state: RootStateOrAny) => state.editor.mapStackData[state.editor.mapStackDataIndex])
  const mExists = m && Object.keys(m).length

  const { data } = useOpenWorkspaceQuery(undefined, { skip:  pageState === PageState.AUTH  })
  const { colorMode, frameId } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch()

  useEffect(()=> {
    getTextDim('Test', 12)
    getEquationDim('\\[Test\\]')
  }, [])

  return (
    <div id="page">
      <ThemeProvider theme={getMuiTheme(colorMode)}>
        {pageState === PageState.AUTH && <Auth/>}
        {
          ![PageState.AUTH].includes(pageState) &&
          <>
            {mExists&&<Map/>}
            <Logo/>
            <ProfileButton/>
            {
              ![PageState.AUTH, PageState.DEMO,].includes(pageState) &&
              <>
                <UndoRedo/>
                <BreadcrumbMaps/>
                <TabMaps/>
                <ControlsLeft/>
                <ControlsRight/>
              </>
            }
            {formatterVisible && mapStackData.length && <Formatter/>}
            {frameId !== '' && <FrameCarousel/>}
          </>
        }
        {pageState === PageState.WS_PROFILE && <Profile/>}
        {pageState === PageState.WS_SETTINGS && <Settings/>}
        {pageState === PageState.WS_SHARES && <Shares/>}
        {pageState === PageState.WS_CREATE_MAP_IN_MAP && <ShouldCreateMapInMap/>}
        {pageState === PageState.WS_CREATE_TABLE && <CreateTable/>}
        {pageState === PageState.WS_CREATE_TASK && <ShouldUpdateTask/>}
        {pageState === PageState.WS_SHARE_THIS_MAP && <ShareThisMap/>}

        <WindowListeners/>
      </ThemeProvider>
    </div>
  )
}
