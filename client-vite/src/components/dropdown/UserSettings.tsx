import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi.ts"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState.ts"
import {SettingsIcon} from "../assets/Icons.tsx"

export const UserSettings = () => {
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible)
  const { data } = useOpenWorkspaceQuery()
  const { colorMode } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          <SettingsIcon/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {colorMode === 'dark' && <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.toggleColorMode.initiate())}>{'Set Color Mode - Light'}</DropdownMenu.Item>}
        {colorMode === 'light' && <DropdownMenu.Item onClick={() => dispatch(nodeApi.endpoints.toggleColorMode.initiate())}>{'Set Color Mode - Dark'}</DropdownMenu.Item>}
        {!connectionHelpersVisible && <DropdownMenu.Item onClick={() => dispatch(actions.showConnectionHelpers())}>{'Helpers - Show'}</DropdownMenu.Item>}
        {connectionHelpersVisible && <DropdownMenu.Item onClick={() => dispatch(actions.hideConnectionHelpers())}>{'Helpers - Hide'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
