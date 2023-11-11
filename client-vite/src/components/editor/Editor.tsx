import {useAuth0} from "@auth0/auth0-react"
import mermaid from "mermaid"
import React, {FC, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Backdrop, CircularProgress} from '@mui/material'
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mSelector} from "../../state/EditorState"
import {ContextMenu} from "../menu/ContextMenu"
import {EditContentEquationModal} from "../modal/EditContentEquationModal"
import {EditContentMermaidModal} from "../modal/EditContentMermaidModal"
import {CreateTableModal} from '../modal/CreateTableModal'
import {ChevronDownIcon, ChevronRightIcon, RedoIcon, UndoIcon} from "../assets/Icons"
import {DeleteAccountDialogContent} from "./DeleteAccountDialogContent"
import {Formatter} from "./Formatter"
import {FrameCarousel} from "./FrameCarousel"
import {Map} from "../map/Map"
import {getEquationDim, getTextDim} from "../map/MapDivUtils"
import {RenameMapModal} from "../modal/RenameMapModal"
import {SharesModal} from "../modal/SharesModal"
import {ShareThisMapModal} from "../modal/ShareThisMapModal"
import {CreateMapInMapModal} from '../modal/CreateMapInMapModal'
import {Window} from "./Window"
import {setColors} from "../assets/Colors"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {AccessTypes, PageState} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {Button, DropdownMenu, IconButton, Theme, Flex, AlertDialog} from "@radix-ui/themes"
import { EditorNode0SelectDropdown } from "./EditorNode0SelectDropdown"
import { EditorNode1InsertDropdown } from "./EditorNode1InsertDropdown"
import { EditorNode2EditDropdown } from "./EditorNode2EditDropdown"
import { EditorNode3MoveDropdown } from "./EditorNode3MoveDropdown"
import { EditorSettingsDropdown } from "./EditorSettingsDropdown"
import { EditorProfileDropdown } from "./EditorProfileDropdown"

export const Editor: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode, access, frameId, breadcrumbMapIdList, breadcrumbMapNameList, tabMapIdList, tabMapNameList, tabId, name } = data || defaultUseOpenWorkspaceQueryState
  const disabled = [AccessTypes.VIEW, AccessTypes.UNAUTHORIZED].includes(access)
  const undoDisabled = disabled || mapListIndex === 0
  const redoDisabled = disabled || mapListIndex === mapList.length - 1
  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=> {
    getTextDim('Test', 12)
    getEquationDim('\\[Test\\]')
    mermaid.initialize({startOnLoad: false, theme: "dark", flowchart: {useMaxWidth: false}})
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
    <Theme accentColor="violet" panelBackground="solid" scaling="100%" radius="full">
      <>
        {
          mExists &&
          <>
            <Map/>
            <div className="dark:bg-zinc-800 bg-zinc-50 dark:border-neutral-700 fixed top-0 left-0 w-screen h-[40px] z-50">

              <div className="fixed top-0 w-[200px] h-[40px] py-1 flex items-center justify-center bg-gradient-to-r from-purple-900 to-purple-700 text-white z-50 rounded-r-lg">
                <h5 style={{fontFamily: "Comfortaa"}} className="text-xl dark:text-white">mapboard</h5>
              </div>

              <div className="fixed left-[220px] h-[40px] flex flex-row items-center">
                <Flex gap="1" align="center">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <IconButton variant="soft" color="gray">
                        <ChevronDownIcon/>
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      {tabMapIdList.map((el: string, index) => (
                        <DropdownMenu.Item key={index} onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: el, frameId: ''}))}>
                          {tabMapNameList[index]?.name}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                  <Button
                    variant={breadcrumbMapIdList.length === 1 ? "solid" : 'soft'}
                    onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: breadcrumbMapIdList[0], frameId: ''}))}>{breadcrumbMapNameList[0].name}
                  </Button>
                  {breadcrumbMapNameList.slice(1).map((el, index) => (
                    <React.Fragment key={index}>
                      <ChevronRightIcon/>
                      <Button
                        variant={index === breadcrumbMapIdList.length - 2 ? "solid" : 'soft'}
                        onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: breadcrumbMapIdList[index + 1], frameId: ''}))}>{el.name}
                      </Button>
                    </React.Fragment>
                  ))}
                </Flex>
              </div>

              <div className="fixed right-[200px] h-[40px] flex flex-row items-center">
                <Flex gap="1" align="center">
                  <EditorNode0SelectDropdown/>
                  <EditorNode1InsertDropdown/>
                  <EditorNode2EditDropdown/>
                  <EditorNode3MoveDropdown/>
                </Flex>
              </div>

              <div className="fixed w-[68px] right-[100px] top-[4px] flex flex-row">
                <Flex gap="1">
                <IconButton variant="solid" color="gray" disabled={undoDisabled} onClick={() => dispatch(actions.mapAction({type: 'undo', payload: null}))}>
                  <UndoIcon/>
                </IconButton>

                <IconButton variant="solid" color="gray" disabled={redoDisabled} onClick={() => dispatch(actions.mapAction({type: 'redo', payload: null}))}>
                  <RedoIcon/>
                </IconButton>
                </Flex>
              </div>

              <div className="fixed w-[68px] right-[4px] top-[4px] flex flex-row">
                <AlertDialog.Root>
                  <Flex gap="1">
                    <EditorSettingsDropdown/>
                    <EditorProfileDropdown/>
                  </Flex>

                  <AlertDialog.Content style={{ maxWidth: 450 }}>
                    <DeleteAccountDialogContent/>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              </div>

            </div>
            {formatterVisible && <Formatter/>}
            <FrameCarousel/>
            <ContextMenu/>
            <Window/>
          </>
        }
        {pageState === PageState.WS_SHARES && <SharesModal/>}
        {pageState === PageState.WS_EDIT_CONTENT_EQUATION && <EditContentEquationModal/>}
        {pageState === PageState.WS_EDIT_CONTENT_MERMAID && <EditContentMermaidModal/>}
        {pageState === PageState.WS_CREATE_TABLE && <CreateTableModal/>}
        {pageState === PageState.WS_CREATE_MAP_IN_MAP && <CreateMapInMapModal/>}
        {pageState === PageState.WS_SHARE_THIS_MAP && <ShareThisMapModal/>}
        {pageState === PageState.WS_LOADING && <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}><CircularProgress color="inherit" /></Backdrop>}
        {pageState === PageState.WS_RENAME_MAP && <RenameMapModal/>}
      </>
    </Theme>
  )
}
