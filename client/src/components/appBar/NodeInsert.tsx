import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { controlTexts, ControlType } from '../../../../shared/src/map/state/map-consts-and-types.ts';
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
        {Object.values(ControlType).map(controlType => (
          <DropdownMenu.Item key={controlType} onClick={() => dispatch(actions.insertNode({ controlType }))}>
            {controlTexts[controlType]}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
