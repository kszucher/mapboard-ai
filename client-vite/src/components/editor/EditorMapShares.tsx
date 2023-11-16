import {Dialog, DropdownMenu, IconButton} from "@radix-ui/themes"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {PageState} from "../../state/Enums"
import {ShareIcon} from "../assets/Icons"
import {EditorMapSharesSharedByMe} from "./EditorMapSharesSharedByMe"
import {EditorMapSharesSharedWithMe} from "./EditorMapSharesSharedWithMe"
import {EditorMapSharesThis} from "./EditorMapSharesThis"

export const EditorMapShares = () => {
  const pageState = useSelector((state: RootState) => state.editor.pageState)
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
            {<DropdownMenu.Item onClick={() => dispatch(actions.setPageState(PageState.WS_SHARE_THIS_MAP))}>{'Share'}</DropdownMenu.Item>}
          </Dialog.Trigger>
          <Dialog.Trigger>
            {<DropdownMenu.Item onClick={() => dispatch(actions.setPageState(PageState.WS_SHARED_BY_ME))}>{'Shared By Me'}</DropdownMenu.Item>}
          </Dialog.Trigger>
          <Dialog.Trigger>
            {<DropdownMenu.Item onClick={() => dispatch(actions.setPageState(PageState.WS_SHARED_WITH_ME))}>{'Shared With Me'}</DropdownMenu.Item>}
          </Dialog.Trigger>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {pageState === PageState.WS_SHARE_THIS_MAP && <EditorMapSharesThis/>}
      {pageState === PageState.WS_SHARED_BY_ME && <EditorMapSharesSharedByMe/>}
      {pageState === PageState.WS_SHARED_WITH_ME && <EditorMapSharesSharedWithMe/>}
    </>
  )
}
