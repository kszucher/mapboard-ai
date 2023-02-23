import React, {FC, Fragment, useEffect} from 'react'
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {copy, isChrome, isEqual} from '../core/Utils'
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
import {api, useOpenWorkspaceQuery} from "../core/Api";
import {M, N} from "../types/DefaultProps";
import {getColors} from "../core/Colors";
import {getPolygonPath, getPolygonPoints} from "../core/SvgUtils";

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

const Layers: FC = () => {

  const nodeList = useSelector((state: RootStateOrAny) => state.editor.nodeList)
  const nodeListSorted = (copy(nodeList)).sort((a: any, b: any) => (a.nodeId > b.nodeId) ? 1 : -1)
  const m = useSelector((state: RootStateOrAny) => state.editor.mapStackData[state.editor.mapStackDataIndex])
  const colorMode = 'dark'
  const {MAP_BACKGROUND} = getColors(colorMode)

  // console.log(nodeList.filter((el: N) => el.fFillColor !== ''))

  return (
    <>
      <g id="layer0">
        {nodeListSorted.map((n: N) => (
          <Fragment key={n.nodeId}>
            {isEqual(n.path, ['g']) &&
              <rect
                key={`${n.nodeId}_svg_backgroundRect`}
                x={0}
                y={0}
                width={m.g.mapWidth}
                height={m.g.mapHeight}
                rx={32}
                ry={32}
                fill={MAP_BACKGROUND}
                style={{
                  transition: '0.3s ease-out'
                }}
              >
              </rect>
            }
          </Fragment>
        ))}
      </g>
      <g id="layer1">
        {nodeListSorted.map((n: N) => (
          <Fragment key={n.nodeId}>
            {n.fFillColor && n.fFillColor !== '' &&
              <path
                key={`${n.nodeId}_svg_branchFill`}
                d={getPolygonPath(n, getPolygonPoints('f', n), 'f', 0)}
                fill={n.fFillColor}
                vectorEffect={'non-scaling-stroke'}
                style={{
                  transition: 'all 0.3s',
                  transitionTimingFunction: 'cubic-bezier(0.0,0.0,0.58,1.0)',
                  transitionProperty: 'd, fill'
                }}
              >
              </path>
            }
          </Fragment>
        ))}
      </g>
    </>
  )
}

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
