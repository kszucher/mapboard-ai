import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch, useSelector } from 'react-redux';
import Eye from '../../../assets/eye.svg?react';
import { actions } from '../../data/clientSide/Reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';

export const ConfigView = () => {
  const linkHelpersVisible = useSelector((state: RootState) => state.editor.linkHelpersVisible);
  const rootFrameVisible = useSelector((state: RootState) => state.editor.rootFrameVisible);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          <Eye />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
        <DropdownMenu.Item onClick={() => dispatch(actions.setLinkHelpersVisible(!linkHelpersVisible))}>
          {linkHelpersVisible ? 'Hide Link Helpers' : 'Show Link Helpers'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(actions.setRootFrameVisible(!rootFrameVisible))}>
          {rootFrameVisible ? 'Hide Frame' : 'Show Frame'}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
