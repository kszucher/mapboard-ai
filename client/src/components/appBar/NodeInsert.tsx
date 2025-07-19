import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { ControlType } from '../../../../shared/src/map/state/map-consts-and-types.ts';
import Plus from '../../../assets/plus.svg?react';
import { actions } from '../../data/reducer.ts';
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
        <DropdownMenu.Item onClick={() => dispatch(actions.insertNode({ controlType: ControlType.FILE }))}>
          {'File Upload'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(actions.insertNode({ controlType: ControlType.INGESTION }))}>
          {'Ingestion'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(actions.insertNode({ controlType: ControlType.CONTEXT }))}>
          {'Context'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(actions.insertNode({ controlType: ControlType.QUESTION }))}>
          {'Question'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(actions.insertNode({ controlType: ControlType.VECTOR_DATABASE }))}>
          {'Vector Database'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(actions.insertNode({ controlType: ControlType.LLM }))}>
          {'LLM'}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
