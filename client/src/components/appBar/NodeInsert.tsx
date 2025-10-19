import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { defaultMapConfig } from '../../../../shared/src/api/api-types-map-config.ts';
import { ControlType } from '../../../../shared/src/api/api-types-map-node.ts';
import Plus from '../../../assets/plus.svg?react';
import { api, useGetMapConfigInfoQuery, useGetMapInfoQuery } from '../../data/api.ts';
import { AppDispatch } from '../../data/store.ts';

export const NodeInsert = () => {
  const { mapNodeConfigs } = useGetMapConfigInfoQuery().data || defaultMapConfig;
  const mapId = useGetMapInfoQuery().data?.id!;
  const dispatch = useDispatch<AppDispatch>();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          <Plus />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
        {mapNodeConfigs.map(el => (
          <DropdownMenu.Item
            key={el.id}
            onClick={() => dispatch(api.endpoints.insertNode.initiate({ mapId, controlType: el.type as ControlType }))}
          >
            {el.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
