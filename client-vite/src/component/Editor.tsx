import {FC, useEffect} from 'react'
import {RootStateOrAny, useSelector} from "react-redux"
import {ThemeProvider} from '@mui/material'
import {BreadcrumbMaps} from "./BreadcrumbMaps"
import {ControlsLeft} from './ControlsLeft'
import {ControlsRight} from './ControlsRight'
import {CreateTable} from './CreateTable'
import {Formatter} from "./Formatter"
import {FrameCarousel} from "./FrameCarousel"
import {Logo} from "./Logo"
import {Map} from "./Map"
import {getEquationDim, getTextDim} from "./MapDivUtils"
import {getMuiTheme} from "./Mui"
import {Profile} from './Profile'
import {ProfileButton} from './ProfileButton'
import {Settings} from './Settings'
import {Shares} from "./Shares"
import {ShareThisMap} from "./ShareThisMap"
import {ShouldCreateMapInMap} from './ShouldCreateMapInMap'
import {ShouldUpdateTask} from './ShouldUpdateTask'
import {TabMaps} from "./TabMaps"
import {UndoRedo} from './UndoRedo'
import {WindowListeners} from "./WindowListeners"
import {setColors} from "../core/Colors"
import {useOpenWorkspaceQuery} from "../core/Api"
import {PageState} from "../core/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState";

export const Editor: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const formatterVisible = useSelector((state: RootStateOrAny) => state.editor.formatterVisible)
  const m = useSelector((state: RootStateOrAny) => state.editor.mapList[state.editor.mapListIndex])
  const mExists = m && Object.keys(m).length
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState

  useEffect(()=> {
    getTextDim('Test', 12)
    getEquationDim('\\[Test\\]')
  }, [])

  useEffect(() => {
    setColors(colorMode)
  }, [colorMode])

  return (
    <ThemeProvider theme={getMuiTheme('dark')}>
      {
        mExists&&
        <>
          <Map/>
          <UndoRedo/>
          <BreadcrumbMaps/>
          <TabMaps/>
          <ControlsLeft/>
          <ControlsRight/>
          {
            formatterVisible &&
            <Formatter/>
          }
          <FrameCarousel/>
          <WindowListeners/>
        </>
      }
      <Logo/>
      <ProfileButton/>
      {pageState === PageState.WS_PROFILE && <Profile/>}
      {pageState === PageState.WS_SETTINGS && <Settings/>}
      {pageState === PageState.WS_SHARES && <Shares/>}
      {pageState === PageState.WS_CREATE_MAP_IN_MAP && <ShouldCreateMapInMap/>}
      {pageState === PageState.WS_CREATE_TABLE && <CreateTable/>}
      {pageState === PageState.WS_CREATE_TASK && <ShouldUpdateTask/>}
      {pageState === PageState.WS_SHARE_THIS_MAP && <ShareThisMap/>}
    </ThemeProvider>
  )
}
