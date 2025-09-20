import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { controlTexts, ControlType } from '../../../../shared/src/api/api-types-map-node.ts';
import Plus from '../../../assets/plus.svg?react';
import { api, useGetMapInfoQuery } from '../../data/api.ts';
import { AppDispatch } from '../../data/store.ts';

export const NodeInsert = () => {
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
        {Object.values(ControlType).map(controlType => (
          <DropdownMenu.Item
            key={controlType}
            onClick={() => dispatch(api.endpoints.insertNode.initiate({ mapId, controlType }))}
          >
            {controlTexts[controlType]}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
