import { Button, DropdownMenu, IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import ChevronDown from '../../../assets/chevron-down.svg?react';
import { api } from '../../data/serverSide/Api.ts';
import { mapInfoDefaultState, sharesInfoDefaultState, userInfoDefaultState } from '../../data/serverSide/ApiState.ts';
import { AppDispatch } from '../../data/store.ts';
import { MapActions } from './MapActions.tsx';

export const MapSelector: FC = () => {
  const { mapId, mapName } = api.useGetMapInfoQuery().data || mapInfoDefaultState;
  const { tabMapIdList, tabMapNameList } = api.useGetUserInfoQuery().data || userInfoDefaultState;
  const { sharesWithUser } = api.useGetSharesInfoQuery().data || sharesInfoDefaultState;
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
          {tabMapIdList.map((el: string, index) => (
            <DropdownMenu.Item key={index} onClick={() => dispatch(api.endpoints.selectMap.initiate({ mapId: el }))}>
              {tabMapNameList[index]}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator />
          <DropdownMenu.Label>{'Shared Maps'}</DropdownMenu.Label>
          {sharesWithUser.map((el, index) => (
            <DropdownMenu.Item key={index} onClick={() => dispatch(api.endpoints.selectMap.initiate({ mapId: el.id }))}>
              {el.sharedMapName}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Button variant="solid" radius="full" onClick={() => dispatch(api.endpoints.selectMap.initiate({ mapId }))}>
        {mapName}
      </Button>
      <MapActions />
    </div>
  );
};
