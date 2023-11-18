import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {DialogState} from "../../state/Enums"
import {ShareIcon} from "../assets/Icons"
import {EditorMapSharesSharedByMe} from "./EditorMapSharesSharedByMe"
import {EditorMapSharesSharedWithMe} from "./EditorMapSharesSharedWithMe"
import {EditorMapSharesShare} from "./EditorMapSharesShare"

export const EditorMapShares = () => {
  const dialogState = useSelector((state: RootState) => state.editor.dialogState)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="soft" color="gray">
            <ShareIcon/>
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <Dialog.Trigger>
            {<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARE_THIS_MAP))}>{'Share'}</DropdownMenu.Item>}
          </Dialog.Trigger>
          <Dialog.Trigger>
            {<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARED_BY_ME))}>{'Shared By Me'}</DropdownMenu.Item>}
          </Dialog.Trigger>
          <Dialog.Trigger>
            {<DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARED_WITH_ME))}>{'Shared With Me'}</DropdownMenu.Item>}
          </Dialog.Trigger>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {dialogState === DialogState.SHARE_THIS_MAP && <EditorMapSharesShare/>}
      {dialogState === DialogState.SHARED_BY_ME && <EditorMapSharesSharedByMe/>}
      {dialogState === DialogState.SHARED_WITH_ME && <EditorMapSharesSharedWithMe/>}
    </>
  )
}
