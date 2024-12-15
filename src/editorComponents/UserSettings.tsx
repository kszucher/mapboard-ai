import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch, useSelector } from 'react-redux';
import Settings2 from '../../assets/settings-2.svg?react';
import { userInfoDefaultState } from '../apiState/ApiState.ts';
import { actions } from '../editorMutations/EditorMutations.ts';
import { api, AppDispatch, RootState } from '../rootComponent/RootComponent.tsx';

export const UserSettings = () => {
  const connectionHelpersVisible = useSelector((state: RootState) => state.editor.connectionHelpersVisible);
  const { colorMode } = api.useGetUserInfoQuery().data || userInfoDefaultState;
  const dispatch = useDispatch<AppDispatch>();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          <Settings2 />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
        {colorMode === 'DARK' && (
          <DropdownMenu.Item onClick={() => dispatch(api.endpoints.toggleColorMode.initiate())}>
            {'Light Mode'}
          </DropdownMenu.Item>
        )}
        {colorMode === 'LIGHT' && (
          <DropdownMenu.Item onClick={() => dispatch(api.endpoints.toggleColorMode.initiate())}>
            {'Dark Mode'}
          </DropdownMenu.Item>
        )}
        {!connectionHelpersVisible && (
          <DropdownMenu.Item onClick={() => dispatch(actions.showConnectionHelpers())}>
            {'Show Helpers'}
          </DropdownMenu.Item>
        )}
        {connectionHelpersVisible && (
          <DropdownMenu.Item onClick={() => dispatch(actions.hideConnectionHelpers())}>
            {'Hide Helpers'}
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
