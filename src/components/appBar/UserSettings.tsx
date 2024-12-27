import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch, useSelector } from 'react-redux';
import Settings2 from '../../../assets/settings-2.svg?react';
import { api } from '../../data/serverSide/Api.ts';
import { userInfoDefaultState } from '../../data/serverSide/ApiState.ts';
import { actions } from '../../data/clientSide/Reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';

export const UserSettings = () => {
  const linkHelpersVisible = useSelector((state: RootState) => state.editor.linkHelpersVisible);
  const rootFrameVisible = useSelector((state: RootState) => state.editor.rootFrameVisible);
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
        <DropdownMenu.Item onClick={() => dispatch(actions.setLinkHelpersVisible(!linkHelpersVisible))}>
          {linkHelpersVisible ? 'Hide Link Helpers' : 'Show Link Helpers'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(actions.setRootFrameVisible(!rootFrameVisible))}>
          {rootFrameVisible ? 'Hide Frame' : 'Show Frame'}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
