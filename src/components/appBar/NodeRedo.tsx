import { IconButton } from '@radix-ui/themes';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ArrowForwardUp from '../../../assets/arrow-forward-up.svg?react';
import { AccessType } from '../../data/clientSide/EditorStateTypes.ts';
import { actions } from '../../data/clientSide/Reducer.ts';
import { api } from '../../data/serverSide/Api.ts';
import { sharesInfoDefaultState } from '../../data/serverSide/ApiState.ts';
import { AppDispatch, RootState } from '../../data/store.ts';

export const NodeRedo: FC = () => {
  const mapId = useSelector((state: RootState) => state.editor.mapId);
  const commitList = useSelector((state: RootState) => state.editor.commitList);
  const commitIndex = useSelector((state: RootState) => state.editor.commitIndex);
  const { sharesWithUser } = api.useGetSharesInfoQuery().data || sharesInfoDefaultState;
  const access = sharesWithUser.find(el => el.id === mapId)?.access || AccessType.EDIT;
  const redoDisabled = access !== AccessType.EDIT || commitIndex === commitList.length - 1;
  const dispatch = useDispatch<AppDispatch>();
  return (
    <IconButton variant="solid" color="gray" disabled={redoDisabled} onClick={() => dispatch(actions.redo())}>
      <ArrowForwardUp />
    </IconButton>
  );
};
