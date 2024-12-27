import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch, useSelector } from 'react-redux';
import Settings2 from '../../../assets/settings-2.svg?react';
import { api } from '../../data/serverSide/Api.ts';
import { userInfoDefaultState } from '../../data/serverSide/ApiState.ts';
import { actions } from '../../data/clientSide/Reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';

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
