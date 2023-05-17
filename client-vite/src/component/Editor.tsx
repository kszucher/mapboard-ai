import {FC, useEffect} from 'react'
import {useSelector} from "react-redux"
import {ThemeProvider} from '@mui/material'
import {RootState} from "../editor/EditorReducer"
import {mSelector} from "../state/EditorState";
import {BreadcrumbMaps} from "./BreadcrumbMaps"
import {ModalCreateGptNodes} from "./ModalCreateGptNodes"
import {SidebarLeft} from './SidebarLeft'
import {SidebarRight} from './SidebarRight'
import {ModalCreateTable} from './ModalCreateTable'
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
import {ModalShareThisMap} from "./ModalShareThisMap"
import {ModalCreateMapInMap} from './ModalCreateMapInMap'
import {ModalToggleTaskMode} from './ModalToggleTaskMode'
import {TabMaps} from "./TabMaps"
import {UndoRedo} from './UndoRedo'
import {WindowListeners} from "./WindowListeners"
import {setColors} from "../core/Colors"
import {useOpenWorkspaceQuery} from "../core/Api"
import {PageState} from "../core/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"

export const Editor: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
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
        mExists &&
        <>
          <Map/>
          <UndoRedo/>
          <BreadcrumbMaps/>
          <TabMaps/>
          <SidebarLeft/>
          <SidebarRight/>
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
      {pageState === PageState.WS_CREATE_GPT_NODES && <ModalCreateGptNodes/>}
      {pageState === PageState.WS_CREATE_TABLE && <ModalCreateTable/>}
      {pageState === PageState.WS_CREATE_TASK && <ModalToggleTaskMode/>}
      {pageState === PageState.WS_CREATE_MAP_IN_MAP && <ModalCreateMapInMap/>}
      {pageState === PageState.WS_SHARE_THIS_MAP && <ModalShareThisMap/>}
    </ThemeProvider>
  )
}
