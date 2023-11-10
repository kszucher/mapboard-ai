import {useAuth0} from "@auth0/auth0-react";
import {Breadcrumb} from "flowbite-react"
import React, {FC, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Backdrop, CircularProgress} from '@mui/material'
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mSelector} from "../../state/EditorState"
import {ContextMenu} from "../menu/ContextMenu"
import {EditContentEquationModal} from "../modal/EditContentEquationModal"
import {EditContentMermaidModal} from "../modal/EditContentMermaidModal"
import {CreateTableModal} from '../modal/CreateTableModal'
import {DeleteAccountDialogContent} from "./DeleteAccountDialogContent";
import {Formatter} from "./Formatter"
import {FrameCarousel} from "./FrameCarousel"
import {Map} from "../map/Map"
import {getEquationDim, getTextDim} from "../map/MapDivUtils"
import {RenameMapModal} from "../modal/RenameMapModal"
import {SharesModal} from "../modal/SharesModal"
import {ShareThisMapModal} from "../modal/ShareThisMapModal"
import {CreateMapInMapModal} from '../modal/CreateMapInMapModal'
import {Window} from "./Window"
import {setColors} from "../misc/Colors"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {AccessTypes, PageState} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {Button, DropdownMenu, IconButton, Theme, Dialog, Flex, TextField, Text, AlertDialog, Separator} from "@radix-ui/themes"

export const Editor: FC = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const tabShrink = useSelector((state: RootState) => state.editor.tabShrink)
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode, access, frameId, breadcrumbMapIdList, breadcrumbMapNameList, tabMapIdList, tabMapNameList, tabId, name } = data || defaultUseOpenWorkspaceQueryState
  const disabled = [AccessTypes.VIEW, AccessTypes.UNAUTHORIZED].includes(access)
  const undoDisabled = disabled || mapListIndex === 0
  const redoDisabled = disabled || mapListIndex === mapList.length - 1
  const dispatch = useDispatch<AppDispatch>()
  const { logout } = useAuth0()

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
    <Theme accentColor="violet" panelBackground="solid" scaling="100%" radius="full">
      <>
        {
          mExists &&
          <>
            <Map/>
            <div className="dark:bg-zinc-800 bg-zinc-50 dark:border-neutral-700 fixed top-0 left-0 w-screen h-[40px] z-50">
              <div className="fixed top-0 w-[220px] h-[40px] py-1 flex items-center justify-center bg-gradient-to-r from-purple-900 to-purple-700 text-white z-50">
                <h5 style={{fontFamily: "Comfortaa"}} className="text-xl dark:text-white">mapboard</h5>
              </div>
              <div className="dark:bg-zinc-800 bg-zinc-50 top-0 fixed left-[260px] h-[40px] flex items-center border-0 py-1 px-4 z-50">
                <Breadcrumb aria-label="Default breadcrumb example">
                  {breadcrumbMapNameList.map((el, index) => (
                    <Breadcrumb.Item
                      href="/"
                      onClick={e => {e.preventDefault(); frameId !== '' ? console.log('prevent') : dispatch(nodeApi.endpoints.selectMap.initiate({mapId: breadcrumbMapIdList[index], frameId: ''}))}}
                      key={index}
                    >
                      {el.name}
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
                {/*<div className="dark:bg-zinc-800 bg-zinc-50 border-2 dark:border-neutral-700 fixed top-0 right-[260px] w-[96px] flex justify-around h-[40px] py-1 border-t-0 rounded-b-lg z-50">*/}
                {/*<IconButton colorMode={colorMode} disabled={undoDisabled} onClick={() => {dispatch(actions.mapAction({type: 'undo', payload: null}))}}><UndoIcon/></IconButton>*/}
                {/*<IconButton colorMode={colorMode} disabled={redoDisabled} onClick={() => {dispatch(actions.mapAction({type: 'redo', payload: null}))}}><RedoIcon/></IconButton>*/}
                {/*</div>*/}
                <div className="fixed w-[68px] right-[4px] top-[4px] flex flex-row">
                  <AlertDialog.Root>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="solid"  color="gray">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icon icon-tabler icon-tabler-settings" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z"></path>
                            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37 1 .608 2.296.07 2.572-1.065z"></path>
                            <path d="M9 12a3 3 0 106 0 3 3 0 00-6 0"></path>
                          </svg>
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content className="bg-red-300">
                        <DropdownMenu.Item onClick={()=>{
                          dispatch(nodeApi.endpoints.toggleColorMode.initiate())
                        }}>{'Toggle Color Mode'}</DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                    <AlertDialog.Content style={{ maxWidth: 450 }}>
                      <DeleteAccountDialogContent/>
                    </AlertDialog.Content>
                    <div className={"w-[4px]"}/>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <IconButton variant="solid"  color="gray">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icon icon-tabler icon-tabler-user" viewBox="0 0 24 24">
                            <path stroke="none" d="M0 0h24v24H0z"></path>
                            <path d="M8 7a4 4 0 108 0 4 4 0 00-8 0M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"></path>
                          </svg>
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content className="bg-red-300">
                        <DropdownMenu.Item onClick={()=>{
                          logout({ logoutParams: { returnTo: window.location.origin }})
                          dispatch(actions.resetState())
                          dispatch(nodeApi.util.resetApiState())
                        }}>{'Sign Out'}</DropdownMenu.Item>
                        <DropdownMenu.Item onClick={()=>{
                          logout({ logoutParams: { returnTo: window.location.origin }})
                          dispatch(nodeApi.endpoints.signOutEverywhere.initiate())
                          dispatch(actions.resetState())
                          dispatch(nodeApi.util.resetApiState())
                        }}>{'Sign Out All Devices'}</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <AlertDialog.Trigger>
                          <DropdownMenu.Item color="red">Delete Account</DropdownMenu.Item>
                        </AlertDialog.Trigger>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                    <AlertDialog.Content style={{ maxWidth: 450 }}>
                      <DeleteAccountDialogContent/>
                    </AlertDialog.Content>
                  </AlertDialog.Root>
                </div>
              </div>
            </div>
            {!tabShrink &&
              <div className="fixed z-50 w-[224px] top-[80px] dark:bg-zinc-800 bg-zinc-50 border-l-0 border-2 dark:border-neutral-700 pt-4 rounded-r-lg">
                <h4 id="sidebar-label" className="sr-only">Browse docs</h4>
                <div id="navWrapper" className="overflow-y-auto z-50 h-full bg-white scrolling-touch max-w-2xs lg:h-[calc(100vh-3rem)] lg:block lg:sticky top:24 lg:top-28 dark:bg-zinc-800 lg:mr-0">
                  <nav id="nav" className="ml-4 pt-16 px-1 pl-3 lg:pl-0 lg:pt-2 font-normal text-base lg:text-sm pb-10 lg:pb-20 sticky?lg:h-(screen-18)" aria-label="Docs navigation">
                    <ul className="mb-0 list-unstyled">
                      <li>
                        <h5 className="mb-2 text-sm font-semibold tracking-wide text-gray-900 uppercase lg:text-xs dark:text-white">Maps</h5>
                        <ul className="py-1 list-unstyled fw-normal small">
                          {tabMapNameList.map((el: { name: string }, index) => (
                            <li key={index}>
                              <a
                                style={{color: tabId === index ? '#ffffff': '', backgroundColor: tabId === index ? '#666666': ''}}
                                data-sidebar-item=""
                                className="rounded hover:bg-purple-700 cursor-pointer py-1 px-1 transition-colors relative flex items-center flex-wrap font-medium hover:text-gray-900 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                                onClick={() => {dispatch(nodeApi.endpoints.selectMap.initiate({mapId: tabMapIdList[index], frameId: ''}))}}
                              >{el.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-8">
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            }
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
