import { Dialog, IconButton } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import TriangleSquareCircle from '../../../assets/triangle-square-circle.svg?react';
import { actions } from '../../data/reducer.ts';
import { DialogState } from '../../data/state-types.ts';
import { AppDispatch } from '../../data/store.ts';

export const MapConfig = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Dialog.Trigger>
      <IconButton variant="solid" color="gray">
        <TriangleSquareCircle
          onClick={() => {
            dispatch(actions.setDialogState(DialogState.MAP_CONFIG));
          }}
        />
      </IconButton>
    </Dialog.Trigger>
  );
};
