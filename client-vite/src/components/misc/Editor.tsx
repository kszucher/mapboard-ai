import React, {FC, useEffect} from 'react'
import {useSelector} from "react-redux"
import {Backdrop, CircularProgress, ThemeProvider} from '@mui/material'
import {RootState} from "../../reducers/EditorReducer"
import {mSelector} from "../../state/EditorState"
import {BreadcrumbMaps} from "../editor/BreadcrumbMaps"
import {ContextMenu} from "../menu/ContextMenu"
import {MenuFrames} from "./MenuFrames"
import {ModalEditContentEquation} from "../modal/ModalEditContentEquation"
import {ModalEditContentMermaid} from "../modal/ModalEditContentMermaid"
import {ModalCreateTable} from '../modal/ModalCreateTable'
import {Formatter} from "../editor/Formatter"
import {FrameCarousel} from "../editor/FrameCarousel"
import {Logo} from "../editor/Logo"
import {Map} from "../map/Map"
import {getEquationDim, getTextDim} from "../map/MapDivUtils"
import {ModalRenameMap} from "../modal/ModalRenameMap"
import {getMuiTheme} from "./Mui"
import {Profile} from '../editor/Profile'
import {SidebarTop} from '../editor/SidebarTop'
import {Settings} from '../editor/Settings'
import {ModalShares} from "../modal/ModalShares"
import {ModalShareThisMap} from "../modal/ModalShareThisMap"
import {ModalCreateMapInMap} from '../modal/ModalCreateMapInMap'
import {TabMaps} from "../editor/TabMaps"
import {UndoRedo} from '../editor/UndoRedo'
import {Window} from "./Window"
import {setColors} from "./Colors"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {PageState} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"

export const Editor: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const tabShrink = useSelector((state: RootState) => state.editor.tabShrink)

  useEffect(()=> {
    getTextDim('Test', 12)
    getEquationDim('\\[Test\\]')
  }, [])

  useEffect(() => {
    setColors(colorMode)
    if (colorMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [colorMode])

  return (
    <ThemeProvider theme={getMuiTheme('dark')}>
      {mExists && <Map/>}
      {mExists && <UndoRedo/>}
      {mExists && <BreadcrumbMaps/>}
      {mExists && !tabShrink && <TabMaps/>}
      {mExists && formatterVisible && <Formatter/>}
      {mExists && <FrameCarousel/>}
      {mExists && <ContextMenu/>}
      {mExists && <Window/>}
      <Logo/>
      <SidebarTop/>
      <MenuFrames/>
      {pageState === PageState.WS_PROFILE && <Profile/>}
      {pageState === PageState.WS_SETTINGS && <Settings/>}
      {pageState === PageState.WS_SHARES && <ModalShares/>}
      {pageState === PageState.WS_EDIT_CONTENT_EQUATION && <ModalEditContentEquation/>}
      {pageState === PageState.WS_EDIT_CONTENT_MERMAID && <ModalEditContentMermaid/>}
      {pageState === PageState.WS_CREATE_TABLE && <ModalCreateTable/>}
      {pageState === PageState.WS_CREATE_MAP_IN_MAP && <ModalCreateMapInMap/>}
      {pageState === PageState.WS_SHARE_THIS_MAP && <ModalShareThisMap/>}
      {pageState === PageState.WS_LOADING && <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}><CircularProgress color="inherit" /></Backdrop>}
      {pageState === PageState.WS_RENAME_MAP && <ModalRenameMap/>}
    </ThemeProvider>
  )
}
