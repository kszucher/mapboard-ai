import {useAuth0} from "@auth0/auth0-react"
import React, {FC, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {Backdrop, CircularProgress} from '@mui/material'
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {mSelector} from "../../state/EditorState"
import {ContextMenu} from "../menu/ContextMenu"
import {EditContentEquationModal} from "../modal/EditContentEquationModal"
import {EditContentMermaidModal} from "../modal/EditContentMermaidModal"
import {CreateTableModal} from '../modal/CreateTableModal'
import {ChevronDownIcon, ChevronRightIcon, RedoIcon, SettingsIcon, UndoIcon, UserIcon} from "../assets/Icons"
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
import {Button, DropdownMenu, IconButton, Theme, Dialog, Flex, TextField, Text, AlertDialog, Separator, Select} from "@radix-ui/themes"

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

              <div className="fixed top-0 w-[220px] h-[40px] py-1 flex items-center justify-center bg-gradient-to-r from-purple-900 to-purple-700 text-white z-50 rounded-r-lg">
                <h5 style={{fontFamily: "Comfortaa"}} className="text-xl dark:text-white">mapboard</h5>
              </div>

              <div className="fixed left-[260px] h-[40px] flex flex-row items-center">

                <IconButton variant="soft" color="gray" onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: tabMapIdList[tabId], frameId: ''}))}>
                  <ChevronDownIcon/>
                </IconButton>

                <div className={"w-[4px]"}/>

                <Select.Root defaultValue={tabMapIdList[tabId]} onValueChange={(value) => dispatch(nodeApi.endpoints.selectMap.initiate({mapId: value, frameId: ''}))}>
                  <Select.Trigger variant="soft"/>
                  <Select.Content position="popper">
                    {tabMapIdList.map((el: string, index) => (
                      <Select.Item value={el} key={index}>{tabMapNameList[index]?.name}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>

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
              </div>

              <div className="fixed right-[200px] top-[4px] flex flex-row items-center">
                <Flex gap="1" align="center">
                  <Button size="2" variant="solid" color="gray" radius="small">
                    {'Select'}
                  </Button>
                  <Button size="2" variant="solid" color="gray" radius="small">
                    {'Insert'}
                  </Button>
                  <Button size="2" variant="solid" color="gray" radius="small">
                    {'Edit'}
                  </Button>
                  <Button size="2" variant="solid" color="gray" radius="small">
                    {'Move'}
                  </Button>
                </Flex>
              </div>

              <div className="fixed w-[68px] right-[100px] top-[4px] flex flex-row">
                <IconButton variant="solid"  color="gray" disabled={undoDisabled} onClick={() => dispatch(actions.mapAction({type: 'undo', payload: null}))}>
                  <UndoIcon/>
                </IconButton>
                <div className={"w-[4px]"}/>
                <IconButton variant="solid"  color="gray" disabled={redoDisabled} onClick={() => dispatch(actions.mapAction({type: 'redo', payload: null}))}>
                  <RedoIcon/>
                </IconButton>
              </div>

              <div className="fixed w-[68px] right-[4px] top-[4px] flex flex-row">
                <AlertDialog.Root>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <IconButton variant="solid"  color="gray">
                        <SettingsIcon/>
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="bg-red-300">
                      <DropdownMenu.Item onClick={()=>{
                        dispatch(nodeApi.endpoints.toggleColorMode.initiate())
                      }}>{'Toggle Color Mode'}</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                  <div className={"w-[4px]"}/>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <IconButton variant="solid"  color="gray">
                        <UserIcon/>
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
