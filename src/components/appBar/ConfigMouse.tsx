import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch, useSelector } from 'react-redux';
import Mouse from '../../../assets/mouse.svg?react';
import { actions } from '../../data/clientSide/Reducer.ts';

import { MidMouseMode } from '../../data/clientSide/EditorStateTypes.ts';
import { AppDispatch, RootState } from '../../data/store.ts';

export const ConfigMouse = () => {
  const midMouseMode = useSelector((state: RootState) => state.editor.midMouseMode);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          <Mouse />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
        <DropdownMenu.RadioGroup
          value={midMouseMode}
          onValueChange={value => dispatch(actions.setMidMouseMode(value as MidMouseMode))}
        >
          <DropdownMenu.RadioItem value={MidMouseMode.SCROLL}>{'Scroll'}</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value={MidMouseMode.ZOOM}>{'Zoom'}</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
