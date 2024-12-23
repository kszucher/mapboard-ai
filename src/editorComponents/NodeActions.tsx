import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import Plus from '../../assets/plus.svg?react';
import { actions } from '../editorMutations/EditorMutations.ts';
import { ControlType } from '../mapState/MapStateTypesEnums.ts';
import { AppDispatch } from '../rootComponent/RootComponent.tsx';

export const NodeActions = () => {
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
