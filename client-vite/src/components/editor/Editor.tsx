import React, {FC, useEffect} from 'react'
import {useSelector} from "react-redux"
import {Backdrop, CircularProgress, ThemeProvider} from '@mui/material'
import {RootState} from "../../reducers/EditorReducer"
import {mSelector} from "../../state/EditorState"
import {BreadcrumbMaps} from "./BreadcrumbMaps"
import {ContextMenu} from "../menu/ContextMenu"
import {EditContentEquationModal} from "../modal/EditContentEquationModal"
import {EditContentMermaidModal} from "../modal/EditContentMermaidModal"
import {CreateTableModal} from '../modal/CreateTableModal'
import {Formatter} from "./Formatter"
import {FrameCarousel} from "./FrameCarousel"
import {Logo} from "./Logo"
import {Map} from "../map/Map"
import {getEquationDim, getTextDim} from "../map/MapDivUtils"
import {RenameMapModal} from "../modal/RenameMapModal"
import {Profile} from './Profile'
import {SidebarTop} from './SidebarTop'
import {Settings} from './Settings'
import {SharesModal} from "../modal/SharesModal"
import {ShareThisMapModal} from "../modal/ShareThisMapModal"
import {CreateMapInMapModal} from '../modal/CreateMapInMapModal'
import {TabMaps} from "./TabMaps"
import {UndoRedo} from './UndoRedo'
import {Window} from "../misc/Window"
import {setColors} from "../misc/Colors"
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
    <>
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
      {pageState === PageState.WS_PROFILE && <Profile/>}
      {pageState === PageState.WS_SETTINGS && <Settings/>}
      {pageState === PageState.WS_SHARES && <SharesModal/>}
      {pageState === PageState.WS_EDIT_CONTENT_EQUATION && <EditContentEquationModal/>}
      {pageState === PageState.WS_EDIT_CONTENT_MERMAID && <EditContentMermaidModal/>}
      {pageState === PageState.WS_CREATE_TABLE && <CreateTableModal/>}
      {pageState === PageState.WS_CREATE_MAP_IN_MAP && <CreateMapInMapModal/>}
      {pageState === PageState.WS_SHARE_THIS_MAP && <ShareThisMapModal/>}
      {pageState === PageState.WS_LOADING && <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}><CircularProgress color="inherit" /></Backdrop>}
      {pageState === PageState.WS_RENAME_MAP && <RenameMapModal/>}
    </>
  )
}
