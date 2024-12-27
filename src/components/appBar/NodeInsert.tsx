import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import Plus from '../../../assets/plus.svg?react';
import { ControlType } from '../../data/clientSide/mapState/MapStateTypes.ts';
import { actions } from '../../data/clientSide/Reducer.ts';
import { AppDispatch } from '../../data/store.ts';

export const NodeInsert = () => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          <Plus />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
        <DropdownMenu.Item onClick={() => dispatch(actions.insertR({ controlType: ControlType.FILE }))}>
          {'File Upload'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(actions.insertR({ controlType: ControlType.INGESTION }))}>
          {'Ingestion'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(actions.insertR({ controlType: ControlType.EXTRACTION }))}>
          {'Extraction'}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
