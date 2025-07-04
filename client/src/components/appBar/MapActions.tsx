import { Dialog, DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import Dots from '../../../assets/dots.svg?react';
import { api, useGetMapInfoQuery, useGetShareInfoQuery } from '../../data/api.ts';
import { actions } from '../../data/reducer.ts';
import { DialogState } from '../../data/state-types.ts';
import { AppDispatch } from '../../data/store.ts';

export const MapActions = () => {
  const mapId = useGetMapInfoQuery().data?.mapInfo.id;
  const sharesWithUser = useGetShareInfoQuery().data?.shareInfo.SharesWithMe;
  const isShared = sharesWithUser?.find(el => el.id === mapId);
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
        <DropdownMenu.Item onClick={() => dispatch(api.endpoints.createMapInTab.initiate({ mapName: 'New Map' }))}>
          {'Create'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => mapId && dispatch(api.endpoints.createMapInTabDuplicate.initiate({ mapId }))}>
          {'Duplicate'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => mapId && dispatch(api.endpoints.moveUpMapInTab.initiate({ mapId }))}>
          {'Move Up'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => mapId && dispatch(api.endpoints.moveDownMapInTab.initiate({ mapId }))}>
          {'Move Down'}
        </DropdownMenu.Item>
        {!isShared && (
          <DropdownMenu.Item onClick={() => mapId && dispatch(api.endpoints.deleteMap.initiate({ mapId }))}>
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
