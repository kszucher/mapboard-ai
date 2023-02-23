import {FC, useEffect} from 'react'
import {RootStateOrAny, useDispatch, useSelector} from "react-redux"
import {isChrome, isEqual} from '../core/Utils'
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
import {N} from "../types/DefaultProps";

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

const nodeList = [] as N[]
// this is going to be super cool, for real, a declarative dream
// de az egy marha jó kérdés, hogy két egymás utáni dispatch vajon képes-e az animációs effektet elérni...
/*TODO: replace key with the good old UNIQUE names once define in DomFlow*/

const Layers: FC = () => {
  return (
    <>
      <g id="layer0">
        {nodeList.map((el: N, index: number) => (
          <g key={index}>
            {isEqual(el.path, ['g']) && <g>
              <svg >
                {/*const {x, y, width, height, rx, ry, fill, fillOpacity, stroke, strokeWidth, preventTransition} = params*/}
                {/*svgElement.setAttribute("x", x)*/}
                {/*svgElement.setAttribute("y", y)*/}
                {/*svgElement.setAttribute("width", width)*/}
                {/*svgElement.setAttribute("height", height)*/}
                {/*svgElement.setAttribute("rx", rx)*/}
                {/*svgElement.setAttribute("ry", ry)*/}
                {/*svgElement.setAttribute("fill", fill)*/}
                {/*svgElement.setAttribute("fill-opacity", fillOpacity)*/}
                {/*svgElement.setAttribute("stroke", checkSvgField(stroke))*/}
                {/*svgElement.setAttribute("stroke-width", strokeWidth)*/}
                {/*svgElement.style.transition = preventTransition ? '' : '0.3s ease-out'*/}
              </svg>
            </g>}
          </g>
        ))}
      </g>
    </>
  )
}

const Map: FC = () => {
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

export const Page: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const formatterVisible = useSelector((state: RootStateOrAny) => state.editor.formatterVisible)
  const mapStackData = useSelector((state: RootStateOrAny) => state.editor.mapStackData)
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
            <Map/>
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
