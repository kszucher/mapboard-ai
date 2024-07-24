import {FC, useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {useOpenWorkspaceQuery} from "../../api/Api.ts"
import {DialogState, AlertDialogState} from "../../state/Enums"
import {defaultUseOpenWorkspaceQueryState} from "../../state/ApiState.ts"
import {Theme, AlertDialog, Dialog, Spinner} from "@radix-ui/themes"
import {mSelector} from "../../state/EditorState"
import {RootExtraction} from "../mapActions/RootExtraction.tsx"
import {RootIngestion} from "../mapActions/RootIngestion.tsx"
import {MapActionsRename} from "../mapActions/MapActionsRename.tsx"
import {Share} from "../shareActions/Share.tsx"
import {SharedByMe} from "../shareActions/SharedByMe.tsx"
import {SharedWithMe} from "../shareActions/SharedWithMe.tsx"
import {NodeActionsEditContentEquation} from "../mapActions/NodeActionsEditContentEquation.tsx"
import {NodeActionsEditCreateSubMap} from "../mapActions/NodeActionsEditCreateSubMap.tsx"
import {NodeActionsInsertTable} from "../mapActions/NodeActionsInsertTable.tsx"
import {EditorAppBarLeft} from "./EditorAppBarLeft.tsx"
import {EditorAppBarMid} from "./EditorAppBarMid.tsx"
import {EditorAppBarRight} from "./EditorAppBarRight.tsx"
import {NodeActionsEditFormatter} from "../mapActions/NodeActionsEditFormatter.tsx"
import {Map} from "../map/Map"
import {getEquationDim, getTextDim} from "../map/MapDivUtils"
import {Window} from "./Window"
import {UserAccountDelete} from "../userActions/UserAccountDelete.tsx"

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
            {formatterVisible && <NodeActionsEditFormatter/>}
            <Window/>
            {alertDialogState === AlertDialogState.DELETE_ACCOUNT && <UserAccountDelete/>}
          </AlertDialog.Root>
          {dialogState === DialogState.RENAME_MAP && <MapActionsRename/>}
          {dialogState === DialogState.SHARE_THIS_MAP && <Share/>}
          {dialogState === DialogState.SHARED_BY_ME && <SharedByMe/>}
          {dialogState === DialogState.SHARED_WITH_ME && <SharedWithMe/>}
          {dialogState === DialogState.CREATE_MAP_IN_MAP && <NodeActionsEditCreateSubMap/>}
          {dialogState === DialogState.EDIT_CONTENT_EQUATION && <NodeActionsEditContentEquation/>}
          {dialogState === DialogState.CREATE_TABLE_U && <NodeActionsInsertTable/>}
          {dialogState === DialogState.CREATE_TABLE_D && <NodeActionsInsertTable/>}
          {dialogState === DialogState.CREATE_TABLE_O && <NodeActionsInsertTable/>}
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
