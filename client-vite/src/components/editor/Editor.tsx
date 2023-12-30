import {FC, Fragment, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import mermaid from "mermaid"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {AccessType, DialogState, AlertDialogState} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState, getMapId} from "../../state/NodeApiState"
import {IconButton, Theme, Flex, AlertDialog, Dialog, DropdownMenu, Button} from "@radix-ui/themes"
import {mSelector} from "../../state/EditorState"
import {Spinner} from "../assets/Spinner"
import {RootExtraction} from "../dialog/RootExtraction.tsx"
import {RootIngestion} from "../dialog/RootIngestion.tsx"
import {MapActions} from "../dropdown/MapActions.tsx"
import {MapActionsRename} from "../dialog/MapActionsRename.tsx"
import {EditorMapControls} from "./EditorMapControls.tsx"
import {MapSharesShare} from "../dialog/MapSharesShare.tsx"
import {MapSharesSharedByMe} from "../dialog/MapSharesSharedByMe.tsx"
import {MapSharesSharedWithMe} from "../dialog/MapSharesSharedWithMe.tsx"
import {MapViews} from "../dropdown/MapViews.tsx"
import {NodeEdit} from "../dropdown/NodeEdit.tsx"
import {NodeEditContentEquation} from "../dialog/NodeEditContentEquation.tsx"
import {NodeEditContentMermaid} from "../dialog/NodeEditContentMermaid.tsx"
import {NodeEditCreateSubMap} from "../dialog/NodeEditCreateSubMap.tsx"
import {NodeInsert} from "../dropdown/NodeInsert.tsx"
import {NodeInsertTable} from "../dialog/NodeInsertTable.tsx"
import {NodeMove} from "../dropdown/NodeMove.tsx"
import {NodeSelect} from "../dropdown/NodeSelect.tsx"
import {UserAccountDelete} from "../dialog/UserAccountDelete.tsx"
import {Formatter} from "./Formatter"
import {Map} from "../map/Map"
import {getEquationDim, getTextDim} from "../map/MapDivUtils"
import {Window} from "./Window"
import {setColors} from "../assets/Colors"
import {UserSettings} from "../dropdown/UserSettings.tsx"
import {UserAccount} from "../dropdown/UserAccount.tsx"
import ArrowBackUp from "../../assets/arrow-back-up.svg?react"
import ArrowForwardUp from "../../assets/arrow-forward-up.svg?react"
import ChevronDown from "../../assets/chevron-down.svg?react"
import ChevronRight from "../../assets/chevron-right.svg?react"
import CircleChevronLeft from "../../assets/circle-chevron-left.svg?react"
import CircleChevronRight from "../../assets/circle-chevron-right.svg?react"

export const Editor: FC = () => {
  const isLoading = useSelector((state: RootState) => state.editor.isLoading)
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const mapList = useSelector((state: RootState) => state.editor.mapList)
  const mapListIndex = useSelector((state: RootState) => state.editor.mapListIndex)
  const { data, isFetching } = useOpenWorkspaceQuery()
  const { colorMode, access, breadcrumbMapIdList, breadcrumbMapNameList, tabMapIdList, tabMapNameList, frameId, frameIdList } = data || defaultUseOpenWorkspaceQueryState
  const frameIdPosition = frameIdList.indexOf(frameId)
  const prevFrameIdPosition = frameIdPosition > 0 ? frameIdPosition - 1 : 0
  const nextFrameIdPosition = frameIdPosition < frameIdList.length - 1 ? frameIdPosition + 1 : frameIdList.length - 1
  const prevFrameId = frameIdList[prevFrameIdPosition]
  const nextFrameId = frameIdList[nextFrameIdPosition]
  const disabled = [AccessType.VIEW, AccessType.UNAUTHORIZED].includes(access)
  const undoDisabled = disabled || mapListIndex === 0
  const redoDisabled = disabled || mapListIndex === mapList.length - 1
  const dialogState = useSelector((state: RootState) => state.editor.dialogState)
  const alertDialogState = useSelector((state: RootState) => state.editor.alertDialogState)
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
      {mExists &&
        <Dialog.Root onOpenChange={(isOpen) => !isOpen && dispatch(actions.setDialogState(DialogState.NONE))}>
          <AlertDialog.Root onOpenChange={(isOpen) => !isOpen && dispatch(actions.setAlertDialogState(AlertDialogState.NONE))}>
            <Map/>
            <div
              className="dark:bg-zinc-800 bg-zinc-50 dark:border-neutral-700 fixed top-0 left-0 w-screen h-[40px] z-50">
              <div
                className="fixed top-0 w-[200px] h-[40px] py-1 flex items-center justify-center bg-gradient-to-r from-purple-900 to-purple-700 text-white z-50 rounded-r-lg">
                <h5 style={{fontFamily: "Comfortaa"}} className="text-xl dark:text-white">mapboard</h5>
              </div>
              <div className="fixed left-1/2 -translate-x-1/2 h-[40px] flex flex-row items-center">
                <Flex gap="1" align="center">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <IconButton variant="soft" color="gray">
                        <ChevronDown/>
                      </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      {tabMapIdList.map((el: string, index) => (
                        <DropdownMenu.Item key={index} onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({
                          mapId: el,
                          frameId: ''
                        }))}>
                          {tabMapNameList[index]?.name}
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                  <Button variant='solid' onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({
                    mapId: breadcrumbMapIdList[0],
                    frameId: ''
                  }))}>
                    {breadcrumbMapNameList[0].name}
                  </Button>
                  {breadcrumbMapNameList.slice(1).map((el, index) => (
                    <Fragment key={index}>
                      <ChevronRight/>
                      <Button variant='solid' onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({
                        mapId: breadcrumbMapIdList[index + 1],
                        frameId: ''
                      }))}>
                        {el.name}
                      </Button>
                    </Fragment>
                  ))}
                  {frameId !== '' &&
                    <>
                      <ChevronRight/>
                      <Button variant='solid' onClick={() => {
                      }}>
                        {`Frame ${frameIdList.indexOf(frameId) + 1}/${frameIdList.length}`}
                      </Button>
                      <IconButton
                        variant="soft"
                        color="gray"
                        disabled={frameIdPosition === 0 || isFetching}
                        onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({
                          mapId: getMapId(),
                          frameId: prevFrameId
                        }))}>
                        <CircleChevronLeft/>
                      </IconButton>
                      <IconButton
                        variant="soft"
                        color="gray"
                        disabled={frameIdPosition === frameIdList.length - 1 || isFetching}
                        onClick={() => dispatch(nodeApi.endpoints.selectMap.initiate({
                          mapId: getMapId(),
                          frameId: nextFrameId
                        }))}>
                        <CircleChevronRight/>
                      </IconButton>
                    </>
                  }
                  <MapActions/>
                </Flex>
              </div>
              <div className="fixed w-[68px] right-[600px] top-[4px] flex flex-row">
                <EditorMapControls/>
              </div>
              <div className="fixed right-[400px] h-[40px] flex flex-row items-center">
                <Flex gap="1" align="center">
                  <MapViews/>
                </Flex>
              </div>
              <div className="fixed right-[200px] h-[40px] flex flex-row items-center">
                <Flex gap="1" align="center">
                  <NodeSelect/>
                  <NodeInsert/>
                  <NodeMove/>
                  <NodeEdit/>
                </Flex>
              </div>
              <div className="fixed w-[68px] right-[100px] top-[4px] flex flex-row">
                <Flex gap="1">
                  <IconButton
                    variant="solid"
                    color="gray"
                    disabled={undoDisabled}
                    onClick={() => dispatch(actions.mapAction({type: 'undo', payload: null}))}>
                    <ArrowBackUp/>
                  </IconButton>
                  <IconButton
                    variant="solid"
                    color="gray"
                    disabled={redoDisabled}
                    onClick={() => dispatch(actions.mapAction({type: 'redo', payload: null}))}>
                    <ArrowForwardUp/>
                  </IconButton>
                </Flex>
              </div>
              <div className="fixed w-[68px] right-[4px] top-[4px] flex flex-row">
                <Flex gap="1">
                  <UserSettings/>
                  <UserAccount/>
                </Flex>
                <UserAccountDelete/>
              </div>
            </div>
            {formatterVisible && <Formatter/>}
            <Window/>
            {alertDialogState === AlertDialogState.DELETE_ACCOUNT && <NodeInsertTable/>}
          </AlertDialog.Root>
          {dialogState === DialogState.RENAME_MAP && <MapActionsRename/>}
          {dialogState === DialogState.SHARE_THIS_MAP && <MapSharesShare/>}
          {dialogState === DialogState.SHARED_BY_ME && <MapSharesSharedByMe/>}
          {dialogState === DialogState.SHARED_WITH_ME && <MapSharesSharedWithMe/>}
          {dialogState === DialogState.CREATE_MAP_IN_MAP && <NodeEditCreateSubMap/>}
          {dialogState === DialogState.EDIT_CONTENT_EQUATION && <NodeEditContentEquation/>}
          {dialogState === DialogState.EDIT_CONTENT_MERMAID && <NodeEditContentMermaid/>}
          {dialogState === DialogState.CREATE_TABLE && <NodeInsertTable/>}
          {dialogState === DialogState.ROOT_INGESTION && <RootIngestion/>}
          {dialogState === DialogState.ROOT_EXTRACTION && <RootExtraction/>}
        </Dialog.Root>
      }
      <div
        style={ isLoading ? {
          opacity: 0.5,
          transition: 'opacity 0.3s ease-out',
          pointerEvents: 'auto'
        } : {
          opacity: 0,
          transition: 'opacity 0.3s ease-in',
          pointerEvents: 'none'
        }}
        className="fixed top-0 left-0 w-screen h-screen bg-zinc-900  flex items-center justify-center z-50"
      >
        <Spinner/>
      </div>
    </Theme>
  )
}
