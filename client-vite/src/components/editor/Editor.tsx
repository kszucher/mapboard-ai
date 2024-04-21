import {FC, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import mermaid from "mermaid"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {DialogState, AlertDialogState} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import {Theme, AlertDialog, Dialog, Spinner} from "@radix-ui/themes"
import {mSelector} from "../../state/EditorState"
import {RootExtraction} from "../dialog/RootExtraction.tsx"
import {RootIngestion} from "../dialog/RootIngestion.tsx"
import {MapActionsRename} from "../dialog/MapActionsRename.tsx"
import {MapSharesShare} from "../dialog/MapSharesShare.tsx"
import {MapSharesSharedByMe} from "../dialog/MapSharesSharedByMe.tsx"
import {MapSharesSharedWithMe} from "../dialog/MapSharesSharedWithMe.tsx"
import {NodeEditContentEquation} from "../dialog/NodeEditContentEquation.tsx"
import {NodeEditContentMermaid} from "../dialog/NodeEditContentMermaid.tsx"
import {NodeEditCreateSubMap} from "../dialog/NodeEditCreateSubMap.tsx"
import {NodeInsertTable} from "../dialog/NodeInsertTable.tsx"
import {EditorAppBarLeft} from "./EditorAppBarLeft.tsx"
import {EditorAppBarMid} from "./EditorAppBarMid.tsx"
import {EditorAppBarRight} from "./EditorAppBarRight.tsx"
import {Formatter} from "./Formatter"
import {Map} from "../map/Map"
import {getEquationDim, getTextDim} from "../map/MapDivUtils"
import {Window} from "./Window"
import {UserAccountDelete} from "../dialog/UserAccountDelete.tsx"

export const Editor: FC = () => {
  const isLoading = useSelector((state: RootState) => state.editor.isLoading)
  const formatterVisible = useSelector((state: RootState) => state.editor.formatterVisible)
  const m = useSelector((state:RootState) => mSelector(state))
  const mExists = m && m.length
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dialogState = useSelector((state: RootState) => state.editor.dialogState)
  const alertDialogState = useSelector((state: RootState) => state.editor.alertDialogState)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=> {
    getTextDim('Test', 12)
    getEquationDim('\\[Test\\]')
    mermaid.initialize({startOnLoad: false, theme: "dark", flowchart: {useMaxWidth: false}})
  }, [])

  return (
    <Theme appearance={colorMode === 'dark' ? 'dark' : 'light'} accentColor="violet" panelBackground="solid" scaling="100%" radius="full">
      {mExists &&
        <Dialog.Root onOpenChange={(isOpen) => !isOpen && dispatch(actions.setDialogState(DialogState.NONE))}>
          <AlertDialog.Root onOpenChange={(isOpen) => !isOpen && dispatch(actions.setAlertDialogState(AlertDialogState.NONE))}>
            <Map/>
            <div className="dark:bg-zinc-800 bg-zinc-50 dark:border-neutral-700 fixed top-0 left-0 w-screen h-[40px] z-50">
              <EditorAppBarLeft/>
              <EditorAppBarMid/>
              <EditorAppBarRight/>
            </div>
            {formatterVisible && <Formatter/>}
            <Window/>
            {alertDialogState === AlertDialogState.DELETE_ACCOUNT && <UserAccountDelete/>}
          </AlertDialog.Root>
          {dialogState === DialogState.RENAME_MAP && <MapActionsRename/>}
          {dialogState === DialogState.SHARE_THIS_MAP && <MapSharesShare/>}
          {dialogState === DialogState.SHARED_BY_ME && <MapSharesSharedByMe/>}
          {dialogState === DialogState.SHARED_WITH_ME && <MapSharesSharedWithMe/>}
          {dialogState === DialogState.CREATE_MAP_IN_MAP && <NodeEditCreateSubMap/>}
          {dialogState === DialogState.EDIT_CONTENT_EQUATION && <NodeEditContentEquation/>}
          {dialogState === DialogState.EDIT_CONTENT_MERMAID && <NodeEditContentMermaid/>}
          {dialogState === DialogState.CREATE_TABLE_U && <NodeInsertTable/>}
          {dialogState === DialogState.CREATE_TABLE_D && <NodeInsertTable/>}
          {dialogState === DialogState.CREATE_TABLE_O && <NodeInsertTable/>}
          {dialogState === DialogState.ROOT_INGESTION && <RootIngestion/>}
          {dialogState === DialogState.ROOT_EXTRACTION && <RootExtraction/>}
        </Dialog.Root>
      }
      <div
        style={isLoading ? {
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
        <Spinner size="3"/>
      </div>
    </Theme>
  )
}
