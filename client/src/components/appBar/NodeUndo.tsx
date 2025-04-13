import { IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ArrowBackUp from '../../../assets/arrow-back-up.svg?react';
import { AccessType } from '../../data/clientSide/EditorStateTypes.ts';
import { actions } from '../../data/clientSide/Reducer.ts';
import { api } from '../../data/serverSide/Api.ts';
import { sharesInfoDefaultState } from '../../data/serverSide/ApiState.ts';
import { AppDispatch, RootState } from '../../data/store.ts';

export const NodeUndo: FC = () => {
  const mapId = useSelector((state: RootState) => state.editor.mapId);
  const commitIndex = useSelector((state: RootState) => state.editor.commitIndex);
  const { sharesWithUser } = api.useGetSharesInfoQuery().data || sharesInfoDefaultState;
  const access = sharesWithUser.find(el => el.id === mapId)?.access || AccessType.EDIT;
  const undoDisabled = access !== AccessType.EDIT || commitIndex === 0;
  const dispatch = useDispatch<AppDispatch>();
  return (
    <IconButton variant="solid" color="gray" disabled={undoDisabled} onClick={() => dispatch(actions.undo())}>
      <ArrowBackUp />
    </IconButton>
  );
};
