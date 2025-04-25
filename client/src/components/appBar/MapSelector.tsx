import { Button, DropdownMenu, IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChevronDown from '../../../assets/chevron-down.svg?react';
import { api } from '../../data/serverSide/Api.ts';
import { AppDispatch, RootState } from '../../data/store.ts';
import { MapActions } from './MapActions.tsx';

export const MapSelector: FC = () => {
  const mapId = useSelector((state: RootState) => state.editor.mapInfo.id);
  const mapName = useSelector((state: RootState) => state.editor.mapInfo.name);
  const tabMapInfo = useSelector((state: RootState) => state.editor.tabMapInfo);
  const sharesWithUser = useSelector((state: RootState) => state.editor.shareInfo.SharesWithMe);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="fixed left-1/2 -translate-x-1/2 h-[40px] flex flex-row items-center gap-1 align-center">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="soft" color="gray" radius="full">
            <ChevronDown />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
          <DropdownMenu.Label>{'My Maps'}</DropdownMenu.Label>
          {tabMapInfo.map((el, index) => (
            <DropdownMenu.Item
              key={index}
              onClick={() => dispatch(api.endpoints.updateWorkspace.initiate({ mapId: el.id }))}
            >
              {tabMapInfo[index].name}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator />
          <DropdownMenu.Label>{'Shared Maps'}</DropdownMenu.Label>
          {sharesWithUser.map((el, index) => (
            <DropdownMenu.Item
              key={index}
              onClick={() => dispatch(api.endpoints.updateWorkspace.initiate({ mapId: el.id }))}
            >
              {el.Map.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Button variant="solid" radius="full" onClick={() => dispatch(api.endpoints.updateWorkspace.initiate({ mapId }))}>
        {mapName}
      </Button>
      <MapActions />
    </div>
  );
};
