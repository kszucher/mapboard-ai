import mermaid from "mermaid"
import React, {FC, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Backdrop, CircularProgress} from '@mui/material'
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mSelector} from "../../state/EditorState"
import {ChevronDownIcon, ChevronRightIcon, RedoIcon, UndoIcon} from "../assets/Icons"
import {EditorMapActions} from "./EditorMapActions"
import {EditorMapFrames} from "./EditorMapFrames"
import {EditorMapShares} from "./EditorMapShares"
import {EditorMapViews} from "./EditorMapViews"
import {EditorNodeEdit} from "./EditorNodeEdit"
import {EditorNodeInsert} from "./EditorNodeInsert"
import {EditorNodeMove} from "./EditorNodeMove"
import {EditorNodeSelect} from "./EditorNodeSelect"
import {EditorUserAccountDeleteAccount} from "./EditorUserAccountDeleteAccount"
import {Formatter} from "./Formatter"
import {FrameCarousel} from "./FrameCarousel"
import {Map} from "../map/Map"
import {getEquationDim, getTextDim} from "../map/MapDivUtils"
import {Window} from "./Window"
import {setColors} from "../assets/Colors"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {AccessTypes, PageState} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {IconButton, Theme, Flex, AlertDialog, Dialog, DropdownMenu, Button} from "@radix-ui/themes"

import { EditorUserSettings } from "./EditorUserSettings"
import { EditorUserAccount } from "./EditorUserAccount"

export const Editor: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode, access, breadcrumbMapIdList, breadcrumbMapNameList, tabMapIdList, tabMapNameList } = data || defaultUseOpenWorkspaceQueryState
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
            <Dialog.Root onOpenChange={(isOpen) => !isOpen && dispatch(actions.setPageState(PageState.WS))}>
              <AlertDialog.Root onOpenChange={(isOpen) => !isOpen && dispatch(actions.setPageState(PageState.WS))}>
                <div className="dark:bg-zinc-800 bg-zinc-50 dark:border-neutral-700 fixed top-0 left-0 w-screen h-[40px] z-50">
                  <div className="fixed top-0 w-[200px] h-[40px] py-1 flex items-center justify-center bg-gradient-to-r from-purple-900 to-purple-700 text-white z-50 rounded-r-lg">
                    <h5 style={{fontFamily: "Comfortaa"}} className="text-xl dark:text-white">mapboard</h5>
                  </div>
                  <div className="fixed left-1/2 -translate-x-1/2 h-[40px] flex flex-row items-center">
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
                        variant={breadcrumbMapIdList.length === 1 ? "solid" : 'solid'}
                        onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: breadcrumbMapIdList[0], frameId: ''}))}>
                        {breadcrumbMapNameList[0].name}
                      </Button>
                      {breadcrumbMapNameList.slice(1).map((el, index) => (
                        <React.Fragment key={index}>
                          <ChevronRightIcon/>
                          <Button
                            variant={index === breadcrumbMapIdList.length - 2 ? "solid" : 'solid'}
                            onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: breadcrumbMapIdList[index + 1], frameId: ''}))}>
                            {el.name}
                          </Button>
                        </React.Fragment>
                      ))}
                      <EditorMapActions/>
                    </Flex>
                  </div>
                  <div className="fixed right-[480px] h-[40px] flex flex-row items-center">
                    <Flex gap="1" align="center">
                      <EditorMapViews/>
                      <EditorMapFrames/>
                      <EditorMapShares/>
                    </Flex>
                  </div>
                  <div className="fixed right-[200px] h-[40px] flex flex-row items-center">
                    <Flex gap="1" align="center">
                      <EditorNodeSelect/>
                      <EditorNodeInsert/>
                      <EditorNodeEdit/>
                      <EditorNodeMove/>
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
                    <Flex gap="1">
                      <EditorUserSettings/>
                      <EditorUserAccount/>
                    </Flex>
                    <AlertDialog.Content style={{ maxWidth: 450 }}>
                      <EditorUserAccountDeleteAccount/>
                    </AlertDialog.Content>
                  </div>
                </div>
                {formatterVisible && <Formatter/>}
                <FrameCarousel/>
                <Window/>
              </AlertDialog.Root>
            </Dialog.Root>
          </>
        }
        {pageState === PageState.WS_LOADING && <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}><CircularProgress color="inherit" /></Backdrop>}
      </>
    </Theme>
  )
}
