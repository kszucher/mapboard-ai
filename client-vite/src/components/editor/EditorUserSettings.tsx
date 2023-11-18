import {DropdownMenu, IconButton} from "@radix-ui/themes"
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {SettingsIcon} from "../assets/Icons"

export const EditorUserSettings = () => {
  const scrollOverride = useSelector((state: RootState) => state.editor.scrollOverride)
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  const { isFetching } = useOpenWorkspaceQuery()
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          <SettingsIcon/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {!isFetching && <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.toggleColorMode.initiate())}>{'Toggle Color Mode'}</DropdownMenu.Item>}
        {!scrollOverride && <DropdownMenu.Item onClick={() => dispatch(actions.setScrollOverride())}>{'Set Scroll Zoom'}</DropdownMenu.Item>}
        {scrollOverride && <DropdownMenu.Item onClick={() => dispatch(actions.clearScrollOverride())}>{'Clear Scroll Zoom'}</DropdownMenu.Item>}
        {!connectionHelpersVisible && <DropdownMenu.Item onClick={() => dispatch(actions.showConnectionHelpers())}>{'Show Helpers'}</DropdownMenu.Item>}
        {connectionHelpersVisible && <DropdownMenu.Item onClick={() => dispatch(actions.hideConnectionHelpers())}>{'Hide Helpers'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
