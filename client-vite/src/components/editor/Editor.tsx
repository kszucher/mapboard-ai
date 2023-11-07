import React, {FC, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Backdrop, CircularProgress} from '@mui/material'
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mSelector} from "../../state/EditorState"
import {IconButton} from "../misc/IconButton"
import {RedoIcon, SettingsIcon, UndoIcon, UserIcon} from "../misc/IconButtonSvg"
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
import {Settings} from './Settings'
import {SharesModal} from "../modal/SharesModal"
import {ShareThisMapModal} from "../modal/ShareThisMapModal"
import {CreateMapInMapModal} from '../modal/CreateMapInMapModal'
import {TabMaps} from "./TabMaps"
import {Window} from "../misc/Window"
import {setColors} from "../misc/Colors"
import {useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {AccessTypes, PageState} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"

export const Editor: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const tabShrink = useSelector((state: RootState) => state.editor.tabShrink)
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode, access } = data || defaultUseOpenWorkspaceQueryState
  const disabled = [AccessTypes.VIEW, AccessTypes.UNAUTHORIZED].includes(access)
  const undoDisabled = disabled || mapListIndex === 0
  const redoDisabled = disabled || mapListIndex === mapList.length - 1
  const dispatch = useDispatch<AppDispatch>()

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
      <Logo/>
      {
        mExists && <>
          <Map/>
          <BreadcrumbMaps/>
          {!tabShrink && <TabMaps/>}
          {formatterVisible && <Formatter/>}
          <FrameCarousel/>
          <ContextMenu/>
          <Window/>
          <div className="dark:bg-zinc-800 bg-zinc-50 border-2 dark:border-neutral-700 fixed top-0 left-[272px] w-[96px] flex justify-around h-[40px] py-1 border-t-0 rounded-b-lg z-50">
            <IconButton colorMode={colorMode} disabled={undoDisabled} onClick={() => {dispatch(actions.mapAction({type: 'undo', payload: null}))}}><UndoIcon/></IconButton>
            <IconButton colorMode={colorMode} disabled={redoDisabled} onClick={() => {dispatch(actions.mapAction({type: 'redo', payload: null}))}}><RedoIcon/></IconButton>
          </div>
          <div className="dark:bg-zinc-800 bg-zinc-50 border-2 dark:border-neutral-700 fixed top-0 right-0 w-[96px] h-[40px] flex flex-row flex-center border-t-0 border-r-0 py-1 px-2 rounded-bl-lg z-50">
            <IconButton colorMode={colorMode} disabled={false} onClick={() => {dispatch(actions.setPageState(PageState.WS_SETTINGS))}}><SettingsIcon/></IconButton>
            <IconButton colorMode={colorMode} disabled={false} onClick={() => {dispatch(actions.setPageState(PageState.WS_PROFILE))}}><UserIcon/></IconButton>
          </div>
        </>
      }
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
