import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { useDispatch, useSelector } from 'react-redux';
import Eye from '../../../assets/eye.svg?react';
import { actions } from '../../data/reducer.ts';
import { AppDispatch, RootState } from '../../data/store.ts';

export const ConfigView = () => {
  const edgeHelpersVisible = useSelector((state: RootState) => state.slice.edgeHelpersVisible);
  const mapFrameVisible = useSelector((state: RootState) => state.slice.mapFrameVisible);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="solid" color="gray">
          <Eye />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
        <DropdownMenu.Item onClick={() => dispatch(actions.setEdgeHelpersVisible(!edgeHelpersVisible))}>
          {edgeHelpersVisible ? 'Hide Edge Helpers' : 'Show Edge Helpers'}
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={() => dispatch(actions.setRootFrameVisible(!mapFrameVisible))}>
          {mapFrameVisible ? 'Hide Frame' : 'Show Frame'}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
