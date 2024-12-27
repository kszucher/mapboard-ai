import { Dialog, DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import Dots from '../../../assets/dots.svg?react';
import { DialogState } from '../../data/clientSide/EditorStateTypes.ts';
import { api } from '../../data/serverSide/Api.ts';
import { mapInfoDefaultState, sharesInfoDefaultState } from '../../data/serverSide/ApiState.ts';
import { actions } from '../../data/clientSide/Reducer.ts';
import { AppDispatch } from '../../data/store.ts';

export const MapActions = () => {
  const { mapId } = api.useGetMapInfoQuery().data || mapInfoDefaultState;
  const { sharesWithUser } = api.useGetSharesInfoQuery().data || sharesInfoDefaultState;
  const isShared = sharesWithUser.find(el => el.id === mapId);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" color="gray" radius="full">
          <Dots />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
        <Dialog.Trigger>
          <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.RENAME_MAP))}>
            {'Rename'}
          </DropdownMenu.Item>
        </Dialog.Trigger>
        <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapInTab.initiate())}>
          {'Create'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapInTabDuplicate.initiate({ mapId }))}>
          {'Duplicate'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(api.endpoints.moveUpMapInTab.initiate({ mapId }))}>
          {'Move Up'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(api.endpoints.moveDownMapInTab.initiate({ mapId }))}>
          {'Move Down'}
        </DropdownMenu.Item>
        {!isShared && (
          <DropdownMenu.Item onClick={() => dispatch(api.endpoints.deleteMap.initiate({ mapId }))}>
            {'Remove'}
          </DropdownMenu.Item>
        )}
        <DropdownMenu.Separator />
        <Dialog.Trigger>
          <DropdownMenu.Item onClick={() => dispatch(actions.setDialogState(DialogState.SHARE_THIS_MAP))}>
            {'Share'}
          </DropdownMenu.Item>
        </Dialog.Trigger>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
