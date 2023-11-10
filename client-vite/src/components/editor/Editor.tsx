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
import {setColors} from "../page/Colors"
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
              <div className="fixed top-0 w-[220px] h-[40px] py-1 flex items-center justify-center bg-gradient-to-r from-purple-900 to-purple-700 text-white z-50 ">
                <h5 style={{fontFamily: "Comfortaa"}} className="text-xl dark:text-white">mapboard</h5>
              </div>
              <div className="fixed w-[68px] left-[260px] top-[4px] flex flex-row">
                <IconButton variant="solid"  color="gray" disabled={undoDisabled} onClick={() => {dispatch(actions.mapAction({type: 'undo', payload: null}))}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icon icon-tabler icon-tabler-arrow-back-up" viewBox="0 0 24 24">
                    <path stroke="none" d="M0 0h24v24H0z"></path>
                    <path d="M9 14l-4-4 4-4"></path>
                    <path d="M5 10h11a4 4 0 110 8h-1"></path>
                  </svg>
                </IconButton>
                <div className={"w-[4px]"}/>
                <IconButton variant="solid"  color="gray" disabled={redoDisabled} onClick={() => {dispatch(actions.mapAction({type: 'redo', payload: null}))}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icon icon-tabler icon-tabler-arrow-forward-up" viewBox="0 0 24 24">
                    <path stroke="none" d="M0 0h24v24H0z"></path>
                    <path d="M15 14l4-4-4-4"></path>
                    <path d="M19 10H8a4 4 0 100 8h1"></path>
                  </svg>
                </IconButton>
              </div>
              <div className="fixed left-[360px] h-[40px] flex flex-row items-center">
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
              </div>
              <div className="fixed w-[68px] right-[4px] top-[4px] flex flex-row">
                <AlertDialog.Root>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <IconButton variant="solid"  color="gray">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="icon icon-tabler icon-tabler-settings-2" viewBox="0 0 24 24">
                          <path stroke="none" d="M0 0h24v24H0z"></path>
                          <path d="M19.875 6.27A2.225 2.225 0 0121 8.218v7.284c0 .809-.443 1.555-1.158 1.948l-6.75 4.27a2.269 2.269 0 01-2.184 0l-6.75-4.27A2.225 2.225 0 013 15.502V8.217c0-.809.443-1.554 1.158-1.947l6.75-3.98a2.33 2.33 0 012.25 0l6.75 3.98h-.033z"></path>
                          <path d="M9 12a3 3 0 106 0 3 3 0 10-6 0"></path>
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
